import retry from "async-retry";

async function fetchStatusPage() {
  const response = await fetch("http://localhost:3000/api/v1/status");
  if (response.status !== 200) {
    throw Error();
  }
}

async function waitForWebServer() {
  return retry(fetchStatusPage, {
    retries: 100,
    minTimeout: 200,
    maxTimeout: 1000,
  });
}

async function waitForAllServices() {
  await waitForWebServer();
}

const orchestrator = {
  waitForAllServices,
};

export default orchestrator;
