/* SiteNova Calendar → Supabase + email. See docs/booking-setup.md. */
function settings_() {
  var p = PropertiesService.getScriptProperties();
  var config = {
    endpoint: p.getProperty("SYNC_ENDPOINT"),
    secret: p.getProperty("SYNC_SECRET"),
    calendar: p.getProperty("CALENDAR_ID"),
    owner: p.getProperty("OWNER_EMAIL"),
    title:
      p.getProperty("APPOINTMENT_TITLE") || "SiteNova Website Consultation",
    recipient: p.getProperty("NOTIFY_EMAIL") || p.getProperty("OWNER_EMAIL"),
  };
  if (
    !config.endpoint ||
    !config.secret ||
    !config.calendar ||
    !config.owner ||
    !config.recipient
  )
    throw new Error("Complete Script Properties before running setup.");
  if (!/^https:\/\//.test(config.endpoint))
    throw new Error("SYNC_ENDPOINT must use HTTPS.");
  return config;
}

function api_(config, payload) {
  var body = JSON.stringify(payload);
  var timestamp = String(Date.now());
  var nonce = Utilities.getUuid();
  var bytes = Utilities.computeHmacSha256Signature(
    timestamp + "." + nonce + "." + body,
    config.secret,
    Utilities.Charset.UTF_8,
  );
  var signature = bytes
    .map(function (b) {
      return ("0" + ((b + 256) % 256).toString(16)).slice(-2);
    })
    .join("");
  var response = UrlFetchApp.fetch(config.endpoint, {
    method: "post",
    contentType: "application/json",
    payload: body,
    muteHttpExceptions: true,
    headers: {
      "x-sync-timestamp": timestamp,
      "x-sync-nonce": nonce,
      "x-sync-signature": signature,
    },
  });
  if (response.getResponseCode() !== 200)
    throw new Error(
      "SiteNova sync returned HTTP " +
        response.getResponseCode() +
        ". Check deployment, SQL and shared secret.",
    );
  return JSON.parse(response.getContentText());
}

function matchesSchedule_(event, config) {
  var title = event.summary || "";
  // Google may append the guest's name to the appointment title.
  return (
    (title === config.title || title.indexOf(config.title + " (") === 0) &&
    event.organizer &&
    event.organizer.email.toLowerCase() === config.owner.toLowerCase() &&
    !event.recurrence &&
    event.start &&
    event.start.dateTime
  );
}

function normalizeEvent_(event, config, known) {
  if (!known && !matchesSchedule_(event, config)) return null;
  var guests = (event.attendees || []).filter(function (a) {
    return (
      !a.organizer &&
      !a.resource &&
      a.email &&
      a.email.toLowerCase() !== config.owner.toLowerCase()
    );
  });
  var cancelled =
    event.status === "cancelled" ||
    (guests.length > 0 &&
      guests.every(function (a) {
        return a.responseStatus === "declined";
      }));
  var out = {
    event_id: event.id,
    version: event.etag || event.updated || "cancelled",
    google_updated_at: event.updated || new Date().toISOString(),
    status: cancelled ? "cancelled" : "scheduled",
  };
  if (cancelled) return out; // Cancellation tombstones often omit title, attendees and times.
  var guest = guests.filter(function (a) {
    return a.responseStatus !== "declined";
  })[0];
  if (
    !guest ||
    !event.start ||
    !event.start.dateTime ||
    !event.end ||
    !event.end.dateTime
  )
    return null;
  out.attendee_name = (guest.displayName || "").slice(0, 200);
  out.attendee_email = guest.email;
  out.starts_at = event.start.dateTime;
  out.ends_at = event.end.dateTime;
  var video = ((event.conferenceData || {}).entryPoints || []).filter(
    function (e) {
      return e.entryPointType === "video";
    },
  )[0];
  out.meet_url = event.hangoutLink || (video && video.uri) || null;
  out.calendar_url = event.htmlLink || null;
  return out;
}

function syncCalendar_(config) {
  var props = PropertiesService.getScriptProperties();
  var tokenKey = "SYNC_TOKEN:" + config.calendar;
  var token = props.getProperty(tokenKey);
  var knownIds = api_(config, {
    action: "state",
    calendar_id: config.calendar,
  }).event_ids;
  var known = {};
  knownIds.forEach(function (id) {
    known[id] = true;
  });
  var seen = {};
  var pageToken;
  var nextToken;
  var started = Date.now();
  do {
    // Do not use q/timeMin/orderBy with an incremental sync token.
    var options = { maxResults: 100, showDeleted: true };
    if (token) options.syncToken = token;
    if (pageToken) options.pageToken = pageToken;
    var page;
    try {
      page = Calendar.Events.list(config.calendar, options);
    } catch (error) {
      if (
        token &&
        /410|full sync|sync token|no longer valid/i.test(String(error))
      ) {
        props.deleteProperty(tokenKey);
        // Retry a full sync next run; persisted booking IDs survive the reset.
        throw new Error(
          "Calendar sync token expired. A full sync will run next time.",
        );
      }
      throw error;
    }
    var events = [];
    (page.items || []).forEach(function (event) {
      if (known[event.id]) seen[event.id] = true;
      var normalized = normalizeEvent_(event, config, known[event.id]);
      if (normalized) events.push(normalized);
    });
    if (events.length)
      api_(config, {
        action: "sync",
        calendar_id: config.calendar,
        events: events,
      });
    pageToken = page.nextPageToken;
    nextToken = page.nextSyncToken;
    // Leave the old checkpoint intact if the run approaches Apps Script's execution limit.
    if (Date.now() - started > 240000)
      throw new Error(
        "Sync time limit approached; checkpoint retained for retry.",
      );
  } while (pageToken);

  if (!token) {
    // Full resyncs can omit deleted events. Reconcile previously imported IDs individually.
    knownIds
      .filter(function (id) {
        return !seen[id];
      })
      .forEach(function (id) {
        var event;
        try {
          event = Calendar.Events.get(config.calendar, id);
        } catch (error) {
          if (!/404|410|not found|deleted/i.test(String(error))) throw error;
          event = { id: id, status: "cancelled", etag: "deleted-on-full-sync" };
        }
        var normalized = normalizeEvent_(event, config, true);
        if (normalized)
          api_(config, {
            action: "sync",
            calendar_id: config.calendar,
            events: [normalized],
          });
      });
  }
  if (!nextToken) throw new Error("Calendar did not return a checkpoint.");
  api_(config, { action: "complete", calendar_id: config.calendar });
  props.setProperty(tokenKey, nextToken);
}

function notificationText_(notification) {
  var p = notification.payload;
  if (notification.kind === "quote")
    return [
      "New website quote request",
      "Name: " + p.name,
      "Email: " + p.email,
      "Phone: " + p.phone,
      "Business: " + p.businessName,
      "Project: " + p.projectType,
      "Budget: " + p.budget,
      "Timeline: " + p.timeline,
      "Details: " + (p.requirements || "Not provided"),
    ].join("\n");
  return [
    notification.kind.replace(/_/g, " "),
    "Attendee: " + (p.attendee_name || p.attendee_email),
    "Email: " + p.attendee_email,
    "Start: " +
      Utilities.formatDate(
        new Date(p.starts_at),
        "Asia/Kolkata",
        "EEE, dd MMM yyyy HH:mm",
      ) +
      " IST",
    "End: " +
      Utilities.formatDate(new Date(p.ends_at), "Asia/Kolkata", "HH:mm") +
      " IST",
    "Status: " + p.status,
    "Google Meet: " + (p.meet_url || "Not available yet"),
    "Google Calendar: " + (p.calendar_url || ""),
  ].join("\n");
}

function deliverNotifications_(config) {
  var notifications = api_(config, { action: "pending" }).notifications;
  for (var i = 0; i < notifications.length; i++) {
    var n = notifications[i];
    if (MailApp.getRemainingDailyQuota() < 1)
      throw new Error("Email quota exhausted; notifications remain queued.");
    try {
      MailApp.sendEmail({
        to: config.recipient,
        subject: "SiteNova — " + n.kind.replace(/_/g, " "),
        body:
          notificationText_(n) +
          "\n\nAdmin: " +
          config.endpoint.split("/api/")[0] +
          "/admin/dashboard\nNotification: " +
          n.id,
        name: "SiteNova Bookings",
      });
    } catch (error) {
      api_(config, {
        action: "ack",
        id: n.id,
        delivered: false,
        error: "MailApp failed; check Apps Script execution log.",
      });
      continue;
    }
    // Stop on acknowledgement failure. A later retry may duplicate this email, but cannot lose it.
    api_(config, { action: "ack", id: n.id, delivered: true });
  }
}

function syncSiteNova() {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(1000)) return;
  try {
    var config = settings_();
    var syncError;
    try {
      syncCalendar_(config);
    } catch (error) {
      syncError = error;
    }
    deliverNotifications_(config); // Quote notifications can still go out during a Calendar outage.
    if (syncError) throw syncError;
  } finally {
    lock.releaseLock();
  }
}

function installSiteNovaTrigger() {
  settings_();
  ScriptApp.getProjectTriggers()
    .filter(function (t) {
      return t.getHandlerFunction() === "syncSiteNova";
    })
    .forEach(function (t) {
      ScriptApp.deleteTrigger(t);
    });
  ScriptApp.newTrigger("syncSiteNova").timeBased().everyMinutes(5).create();
  syncSiteNova();
}
