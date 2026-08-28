const ticketSamples: {
  description: string;
  comments: string;
  severity: "sev 5" | "sev 4" | "sev 3" | "sev 2" | "sev 1";
}[] = [
  {
    description: "500 Internal Server Error: /api/v1/login",
    comments:
      "Intermittent 500 errors occurring during user authentication. Logs indicate a timeout connecting to the Identity Provider (IdP) during peak traffic hours.",
    severity: "sev 1",
  },
  {
    description: "Memory Leak Warning: Pod-Worker-04",
    comments:
      "Node.js heap usage exceeded 85% threshold. Garbage collection is not reclaiming memory; potential leak identified in the PDF generation module after recent deployment.",
    severity: "sev 2",
  },
  {
    description: "Data Inconsistency: User Profile Sync",
    comments:
      "Changes saved in the Admin Portal are not reflecting in the Mobile App. Suspected lag in the Redis cache invalidation logic or message queue delay.",
    severity: "sev 3",
  },
  {
    description: "Stuck Background Job: Monthly_Invoicing",
    comments:
      "The scheduled invoicing job has been in 'Processing' status for 4 hours. No new logs generated since 02:00 AM UTC; heartbeat signal missing.",
    severity: "sev 4",
  },
  {
    description: "SSL Certificate Expiry Warning",
    comments:
      "The wildcard certificate for *.production.app expires in 7 days. Need to trigger the rotation via AWS Certificate Manager and verify Load Balancer attachment.",
    severity: "sev 2",
  },
  {
    description: "Latency Spike: Checkout Gateway",
    comments:
      "P99 latency for the payment gateway has jumped from 200ms to 2.5s. Monitoring shows high database connection pooling wait times during checkout.",
    severity: "sev 4",
  },
  {
    description: "Report Export Failure (CSV/XLSX)",
    comments:
      "Users reporting a 'Network Error' when trying to export reports larger than 50MB. Possible Nginx client_max_body_size restriction or gateway timeout.",
    severity: "sev 5",
  },
  {
    description: "Database Lock Contention",
    comments:
      "Multiple 'Deadlock detected' errors found in PostgreSQL logs during the nightly inventory reconciliation sync. Transactions are being rolled back.",
    severity: "sev 3",
  },
  {
    description: "Broken Image Assets (S3 403 Forbidden)",
    comments:
      "Product images are failing to load on the storefront. Likely a misconfiguration in the S3 Bucket Policy or an expired CloudFront Origin Access Identity.",
    severity: "sev 5",
  },
  {
    description: "Rate Limit Exceeded: Third-Party API",
    comments:
      "Integration with the Geocoding API is returning 429 Too Many Requests. We need to implement a circuit breaker or a more aggressive exponential back-off.",
    severity: "sev 4",
  },
];

export function generateTicketInfo() {
  const selected =
    ticketSamples[Math.floor(Math.random() * ticketSamples.length)];
  return selected;
}
