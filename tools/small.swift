// Small copies of the site's photos: <width> wide, sRGB JPEG, no metadata.
// Usage: small <width> <quality 0-1> <in> <out> [<in> <out> ...]
import Foundation
import ImageIO
import CoreGraphics
import UniformTypeIdentifiers
let a = CommandLine.arguments
let W = Double(a[1])!, Q = Double(a[2])!
var i = 3
while i + 1 < a.count {
  let inU = URL(fileURLWithPath: a[i]) as CFURL, outU = URL(fileURLWithPath: a[i + 1]) as CFURL
  i += 2
  guard let src = CGImageSourceCreateWithURL(inU, nil),
        let props = CGImageSourceCopyPropertiesAtIndex(src, 0, nil) as? [CFString: Any],
        let pw = props[kCGImagePropertyPixelWidth] as? Double, let ph = props[kCGImagePropertyPixelHeight] as? Double else { print("skip", a[i - 2]); continue }
  let long = max(pw, ph) * min(1, W / pw)
  let opts: [CFString: Any] = [kCGImageSourceCreateThumbnailFromImageAlways: true, kCGImageSourceCreateThumbnailWithTransform: true, kCGImageSourceThumbnailMaxPixelSize: Int(long.rounded())]
  guard let img = CGImageSourceCreateThumbnailAtIndex(src, 0, opts as CFDictionary),
        let dst = CGImageDestinationCreateWithURL(outU, UTType.jpeg.identifier as CFString, 1, nil) else { print("fail", a[i - 2]); continue }
  CGImageDestinationAddImage(dst, img, [kCGImageDestinationLossyCompressionQuality: Q] as CFDictionary)
  CGImageDestinationFinalize(dst)
}
