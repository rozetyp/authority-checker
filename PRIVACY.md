# Privacy Policy for Reliable DA Checker

**Last updated:** January 4, 2026

## Overview

Reliable DA Checker is a privacy-first Chrome Extension. We do NOT collect, store, or transmit any user data to our servers. **We have no servers.**

## What We Collect

**Nothing.** This extension does not collect any personal information, browsing history, or usage data.

## What Stays Local (On Your Device)

- Your Moz API credentials (Access ID and Secret Key)
- Your license activation code
- URLs you check for DA/PA metrics

All data is stored locally in your browser using Chrome's `chrome.storage.sync` API. This data syncs across your Chrome browsers if you're signed into Chrome, but it never reaches our servers.

## Third-Party Services

This extension makes direct API calls from your browser to **Moz's servers** (lsapi.seomoz.com) using YOUR API credentials.

Please review Moz's privacy policy: https://moz.com/privacy

## Payment Processing

License purchases are processed through **Stripe**. We do not store your payment information. 

Stripe's privacy policy: https://stripe.com/privacy

## Permissions Explained

- **activeTab:** Required to read the current tab's URL to fetch DA/PA metrics for the domain you're viewing.
- **storage:** Required to save your Moz API credentials and activation code locally in your browser.
- **host_permissions (lsapi.seomoz.com):** Required to make authenticated API requests to Moz's Link API.

## Open Source & Transparency

Our code is fully auditable and open source. You can verify exactly what this extension does:

https://github.com/rozetyp/authority-checker

## Security

Your Moz Secret Key never leaves your machine. All API request signatures are generated locally using the Web Crypto API (`crypto.subtle`) with HMAC-SHA1.

## Changes to This Policy

We will update this policy if our privacy practices change. The "Last updated" date at the top will reflect when changes were made.

## Contact

Questions or concerns? Open an issue on GitHub: https://github.com/rozetyp/authority-checker/issues
