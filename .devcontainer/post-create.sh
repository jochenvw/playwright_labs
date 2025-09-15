printf "Installing dependencies...\n"

npm init playwright@latest -y -- --language=ts --browser=chromium --quiet
npx playwright install-deps