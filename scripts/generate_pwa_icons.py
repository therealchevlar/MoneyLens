import zlib
import struct
import os
import math

def write_png(filename, width, height, is_maskable=False):
    # PNG signature
    png = bytearray(b'\x89PNG\r\n\x1a\n')

    # IHDR
    ihdr_data = struct.pack('!IIBBBBB', width, height, 8, 6, 0, 0, 0)
    ihdr_crc = struct.pack('!I', zlib.crc32(b'IHDR' + ihdr_data) & 0xffffffff)
    png.extend(struct.pack('!I', len(ihdr_data)))
    png.extend(b'IHDR')
    png.extend(ihdr_data)
    png.extend(ihdr_crc)

    raw_data = bytearray()
    center_x = width / 2.0
    center_y = height / 2.0
    max_radius = min(width, height) / 2.0

    # Maskable icons must have safe zone padding (15% padding)
    icon_scale = 0.65 if is_maskable else 0.82
    radius = max_radius * icon_scale

    for y in range(height):
        raw_data.append(0)  # filter type 0: None
        for x in range(width):
            # Coordinates relative to center
            dx = (x - center_x)
            dy = (y - center_y)
            dist = math.sqrt(dx * dx + dy * dy)

            # Background: dark neutral / emerald gradient
            t_grad = (x + y) / (width + height)
            bg_r = int(5 + t_grad * 5)
            bg_g = int(12 + t_grad * 32)
            bg_b = int(10 + t_grad * 15)
            bg_a = 255

            # If not maskable, round outer corners
            if not is_maskable:
                corner_radius = width * 0.22
                cx = abs(x - center_x) - (center_x - corner_radius)
                cy = abs(y - center_y) - (center_y - corner_radius)
                if cx > 0 and cy > 0:
                    cdist = math.sqrt(cx * cx + cy * cy)
                    if cdist > corner_radius:
                        # outside rounded rect
                        raw_data.extend([0, 0, 0, 0])
                        continue

            # Check if within center badge
            if dist < radius:
                # Lens ring & spark
                ring_thickness = width * 0.04
                outer_ring = radius * 0.75
                inner_ring = outer_ring - ring_thickness

                if inner_ring <= dist <= outer_ring:
                    # Emerald accent ring
                    r, g, b = 52, 211, 153 # #34d399
                elif dist < inner_ring * 0.75:
                    # Central financial core
                    # Draw a diagonal lightning / spark shape
                    in_spark = (-width * 0.08 <= dx - dy * 0.5 <= width * 0.08) and (abs(dy) < radius * 0.5)
                    if in_spark:
                        r, g, b = 16, 185, 129 # #10b981
                    else:
                        r, g, b = 4, 31, 21
                else:
                    # Inner glow area
                    fade = 1.0 - (dist / radius)
                    r = int(bg_r + fade * 30)
                    g = int(bg_g + fade * 120)
                    b = int(bg_b + fade * 80)
            else:
                r, g, b = bg_r, bg_g, bg_b

            raw_data.extend([min(255, max(0, r)), min(255, max(0, g)), min(255, max(0, b)), bg_a])

    # IDAT
    compressed = zlib.compress(bytes(raw_data), 9)
    idat_crc = struct.pack('!I', zlib.crc32(b'IDAT' + compressed) & 0xffffffff)
    png.extend(struct.pack('!I', len(compressed)))
    png.extend(b'IDAT')
    png.extend(compressed)
    png.extend(idat_crc)

    # IEND
    iend_crc = struct.pack('!I', zlib.crc32(b'IEND') & 0xffffffff)
    png.extend(struct.pack('!I', 0))
    png.extend(b'IEND')
    png.extend(iend_crc)

    os.makedirs(os.path.dirname(filename), exist_ok=True)
    with open(filename, 'wb') as f:
        f.write(png)
    print(f"Generated {filename} ({width}x{height})")

if __name__ == '__main__':
    write_png('public/pwa-192x192.png', 192, 192, is_maskable=False)
    write_png('public/pwa-512x512.png', 512, 512, is_maskable=False)
    write_png('public/pwa-maskable-512x512.png', 512, 512, is_maskable=True)
    write_png('public/apple-touch-icon.png', 180, 180, is_maskable=False)
