import subprocess, os, sys

os.chdir(r"F:\Websites\personal\Business\novasite-launch-main")

def run(cmd):
    r = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    print("STDOUT:", r.stdout)
    print("STDERR:", r.stderr)
    print("RC:", r.returncode)
    return r.returncode

print("=== git log ===")
run("git log --oneline -5")

print("\n=== git status ===")
run("git status --short")

print("\n=== git remote ===")
run("git remote -v")

# Stage all pending changes
print("\n=== git add ===")
run("git add -A")

# Check if there's anything to commit
r = subprocess.run("git status --short", shell=True, capture_output=True, text=True)
print("Status:", r.stdout)

if r.stdout.strip():
    print("\n=== git commit ===")
    run('git commit -m "chore: improve CI workflow, add .gitattributes, remove setup script"')
    print("\n=== git push ===")
    rc = run("git push origin main")
    if rc == 0:
        print("\n✅ PUSHED SUCCESSFULLY")
    else:
        print("\n❌ PUSH FAILED")
else:
    print("\n✅ Nothing to commit - already up to date")
    run("git push origin main")

