const axios = require("axios");
const asyncHandler = require("../utils/asyncHandler");

const proxyFile = asyncHandler(async (req, res) => {
  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).json({
      success: false,
      message: "Missing url query parameter",
    });
  }

  let parsedUrl;

  try {
    parsedUrl = new URL(targetUrl);
  } catch {
    return res.status(400).json({
      success: false,
      message: "Invalid file URL",
    });
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    return res.status(400).json({
      success: false,
      message: "Only http and https URLs are supported",
    });
  }

  let upstream;
  try {
    upstream = await axios.get(parsedUrl.toString(), {
      responseType: "stream",
      headers: {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
        Accept: "*/*",
      },
      timeout: 30000,
      maxRedirects: 10,
      validateStatus: () => true,
    });
  } catch (fetchErr) {
    console.error(`Fetch error for ${targetUrl}:`, fetchErr.message);
    return res.status(502).json({
      success: false,
      message: `Failed to fetch file: ${fetchErr.message}`,
    });
  }

  if (upstream.status >= 400 || !upstream.data) {
    console.error(`Upstream request failed for ${targetUrl}:`, upstream.status);
    return res.status(upstream.status || 502).json({
      success: false,
      message: `Upstream request failed with status ${upstream.status}`,
    });
  }

  res.setHeader(
    "Content-Type",
    upstream.headers["content-type"] || "application/octet-stream"
  );

  const contentLength = upstream.headers["content-length"];
  if (contentLength) {
    res.setHeader("Content-Length", contentLength);
  }

  const disposition = upstream.headers["content-disposition"];
  if (disposition) {
    res.setHeader("Content-Disposition", disposition);
  }

  upstream.data.on("error", (err) => {
    console.error(`Stream error for ${targetUrl}:`, err.message);
    if (!res.headersSent) {
      res.status(502).json({
        success: false,
        message: `Failed to stream file: ${err.message}`,
      });
    } else {
      res.destroy(err);
    }
  });

  upstream.data.pipe(res);
});

module.exports = {
  proxyFile,
};
