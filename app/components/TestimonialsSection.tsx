import { ArrowUpRight, Star } from "lucide-react";
import { Link } from "react-router";
import { clientReviews } from "@/lib/client-reviews";
import "./studio-sections.css";

export default function TestimonialsSection() {
  return <section id="testimonials" className="sn-section sn-reviews" aria-labelledby="testimonials-title"><div className="sn-container">
    <div className="sn-section-head"><div><p className="sn-kicker">From the people we build for</p><h2 id="testimonials-title">Good work.<br />Happy clients.</h2></div><a href="https://share.google/oVC1Tao0mO4WiGiOt" target="_blank" rel="noopener noreferrer" className="sn-text-link">Write a review<ArrowUpRight size={17} aria-hidden="true" /></a></div>
    <div className="sn-review-grid">{Object.values(clientReviews).map((review) => <article key={review.name} className={review.content ? "sn-review" : "sn-review sn-review--rating"}>
      <div className="sn-stars" role="img" aria-label={`${review.rating} out of 5 stars${review.source ? ` on ${review.source}` : ""}`}>{Array.from({ length: review.rating }, (_, index) => <Star key={index} size={15} fill="currentColor" aria-hidden="true" />)}</div>
      {review.content ? <blockquote><p>“{review.content}”</p></blockquote> : <div className="sn-rating-copy"><span aria-hidden="true">5.0</span><h3>5-star Google rating</h3><p>Rating only — no written review.</p></div>}
      <div className="sn-review-author"><a href={review.website} target="_blank" rel="noopener noreferrer">{review.name}<ArrowUpRight size={14} aria-hidden="true" /></a><p>{review.role}</p><Link to={review.caseStudyPath} className="sn-text-link">View case study<span className="sr-only"> for {review.name}</span><ArrowUpRight size={14} aria-hidden="true" /></Link></div>
    </article>)}</div>
  </div></section>;
}
