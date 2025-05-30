import { NextRequest, NextResponse } from 'next/server.js'

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams
  const path = searchParams.get('path') || '/'

  const scriptContent = `
<!DOCTYPE html>
<html>
<head>
  <title>rb2b Script</title>
  <script>
    window.currentPath = "${path}";
  </script>
</head>
<body>
  <script>
    !function () {var reb2b = window.reb2b = window.reb2b || [];if (reb2b.invoked) return;reb2b.invoked = true;reb2b.methods = ["identify", "collect"];reb2b.factory = function (method) {return function () {var args = Array.prototype.slice.call(arguments);args.unshift(method);reb2b.push(args);return reb2b;};};for (var i = 0; i < reb2b.methods.length; i++) {var key = reb2b.methods[i];reb2b[key] = reb2b.factory(key);}reb2b.load = function (key) {var script = document.createElement("script");script.type = "text/javascript";script.async = true;script.src = "https://s3-us-west-2.amazonaws.com/b2bjsstore/b/" + key + "/1N5W0HM7EGO5.js.gz";var first = document.getElementsByTagName("script")[0];first.parentNode.insertBefore(script, first);};reb2b.SNIPPET_VERSION = "1.0.1";reb2b.load("1N5W0HM7EGO5");}();
  </script>
</body>
</html>
  `

  return new NextResponse(scriptContent, {
    headers: {
      'Content-Type': 'text/html',
    },
  })
}
