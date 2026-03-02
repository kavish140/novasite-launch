import subprocess, os

os.chdir(r"F:\Websites\personal\Business\novasite-launch-main")

# Delete gitpush.py itself
os.remove("gitpush.py")
print("Deleted gitpush.py")

# Stage, commit, push
subprocess.run("git add -A", shell=True)
r = subprocess.run('git commit -m "chore: remove helper scripts"', shell=True, capture_output=True, text=True)
print("Commit:", r.stdout.strip(), r.stderr.strip())

r2 = subprocess.run("git push origin main", shell=True, capture_output=True, text=True)
print("Push:", r2.stdout.strip(), r2.stderr.strip())
print("Done!" if r2.returncode == 0 else "Failed!")

