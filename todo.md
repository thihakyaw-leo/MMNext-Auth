# Full-stack and File Storage upgrade

- [x] Upgrade the static project to web-db-user full-stack scaffolding.
- [x] Inspect the generated storage helpers, database schema, and tRPC contracts.
- [x] Define the file metadata model and protected storage procedures.
- [x] Add the frontend upload and file-list management experience.
- [x] Run migrations, type checks, tests, and production build.
- [x] Save a new checkpoint and document required setup variables.

- [x] Replace base64 conversion with a chunk-safe encoder for files near 8 MB.
- [x] Add explicit list-query error state to the File Storage page.
- [x] Browser-test the File Storage upload and failure states after the safer encoding fix.

- [x] Verify the target GitHub remote, current branch, and working tree before pushing.
- [x] Confirm secrets and generated files are excluded from the commit.
- [x] Commit the current MMNext POS full-stack project and push it to the requested repository.
- [x] Verify the remote branch and report the push result.
- [x] Confirm whether to push the POS app to a new branch or replace/merge the existing Auth Server main branch.

- [x] Confirm Cloudflare build/runtime requirements for the full-stack project.
- [x] Add Cloudflare deployment configuration and a detailed deployment guide.
- [x] Commit all current changes and force-push this project to GitHub main, replacing the old Auth Server.
- [x] Verify GitHub main and document final Cloudflare environment variables and OAuth callback steps.
