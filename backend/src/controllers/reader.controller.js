const { Readable } = require("stream");
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

  const upstream = await fetch(parsedUrl.toString(), {
    redirect: "follow",
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; hybrid-ml-reader/1.0)",
      Accept: "*/*",
    },
  });

  if (!upstream.ok || !upstream.body) {
    return res.status(upstream.status || 502).json({
      success: false,
      message: `Upstream request failed with status ${upstream.status}`,
    });
  }

  res.setHeader(
    "Content-Type",
    upstream.headers.get("content-type") || "application/octet-stream"
  );

  const contentLength = upstream.headers.get("content-length");
  if (contentLength) {
    res.setHeader("Content-Length", contentLength);
  }

  const disposition = upstream.headers.get("content-disposition");
  if (disposition) {
    res.setHeader("Content-Disposition", disposition);
  }

  // Handle web stream piping for older Node versions
  if (typeof Readable.fromWeb === 'function') {
    Readable.fromWeb(upstream.body).pipe(res);
  } else {
    // Fallback for Node < 17: convert web stream to Node stream
    const reader = upstream.body.getReader();
    const stream = new Readable({
      async read() {
        try {
          const { done, value } = await reader.read();
          if (done) {
            this.push(null);
          } else {
            this.push(value);
          }
        } catch (err) {
          this.destroy(err);
        }
      }
    });
    stream.pipe(res);
  }
});

module.exports = {
  proxyFile,
};
