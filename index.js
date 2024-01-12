const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const GRADIENT = [[1, 1], [-1, 1], [1, -1], [-1, -1], [1, 0], [-1, 0], [1, 0], [-1, 0], [0, 1], [0, -1], [0, 1], [0, -1]];
const F2 = 0.5 * (3.0 ** 0.5 - 1.0);
const G2 = (3.0 - 3.0 ** 0.5) / 6.0;

const NOISE = [64, 175, 124, 148, 10, 239, 244, 91, 138, 73, 228, 171, 27, 134, 77, 122, 238, 196, 202, 181, 211, 7, 49, 173, 48, 165, 120, 217, 129, 56, 153, 8, 140, 141, 21, 130, 71, 100, 132, 23, 176, 250, 29, 104, 149, 159, 180, 237, 247, 11, 252, 241, 14, 2, 219, 75, 178, 151, 233, 251, 103, 45, 52, 201, 222, 18, 223, 88, 136, 34, 227, 235, 35, 160, 0, 131, 51, 214, 39, 216, 207, 26, 137, 185, 41, 13, 249, 54, 112, 5, 66, 242, 157, 158, 28, 89, 86, 192, 172, 17, 69, 204, 38, 221, 65, 166, 9, 226, 33, 30, 84, 240, 59, 224, 127, 108, 92, 146, 99, 195, 255, 98, 126, 4, 133, 236, 189, 121, 144, 183, 80, 109, 191, 218, 161, 53, 25, 93, 72, 150, 163, 234, 205, 152, 61, 37, 197, 78, 81, 32, 85, 70, 187, 63, 96, 115, 117, 184, 139, 79, 74, 46, 188, 182, 76, 31, 174, 57, 68, 198, 90, 245, 230, 106, 94, 212, 190, 16, 200, 213, 206, 44, 43, 215, 231, 12, 177, 203, 220, 24, 170, 19, 209, 82, 95, 125, 194, 248, 208, 55, 67, 1, 87, 110, 135, 162, 128, 3, 60, 225, 15, 186, 232, 145, 119, 142, 113, 154, 102, 164, 42, 156, 210, 22, 253, 147, 169, 193, 83, 143, 118, 123, 254, 167, 111, 114, 6, 50, 40, 199, 179, 246, 20, 107, 168, 97, 229, 101, 155, 62, 47, 58, 116, 243, 105, 36,];

const FLOWERS = [
  dandelion,
  poppy,
  allium,
  azure_bluet,
  red_tulip,
  orange_tulip,
  white_tulip,
  pink_tulip,
  oxeye_daisy,
  cornflower,
  lily_of_the_valley,
];

function grad_dot(a, b, c) {
  const grad = GRADIENT[a];
  return grad[0] * b + grad[1] * c;
}

function corner_noise(i, a, b) {
  const e = 0.5 - a * a - b * b;
  const f = e < 0.0 ? 0.0 : e ** 4 * grad_dot(i, a, b);
  return f;
}

function sample(d, d2) {
  const d6 = (d + d2) * F2;
  const n4 = Math.floor(d + d6);
  const d7 = n4 - (d3 = (n4 + (n3 = Math.floor(d2 + d6))) * G2);
  const d8 = d - d7;
  let a, b;
  if (d8 > (d4 = d2 - (n3 - d3))) {
    a = 1;
    b = 0;
  } else {
    a = 0;
    b = 1;
  }
  const d9 = d8 - a + G2;
  const d10 = d4 - b + G2;
  const d11 = d8 - 1.0 + 2.0 * G2;
  const d12 = d4 - 1.0 + 2.0 * G2;
  const n5 = n4 & 0xFF;
  const n6 = n3 & 0xFF;
  const n7 = NOISE[(n5 + NOISE[n6]) & 0xFF] % 12;
  const n8 = NOISE[(n5 + a + NOISE[(n6 + b) & 0xFF]) & 0xFF] % 12;
  const n9 = NOISE[(n5 + 1 + NOISE[(n6 + 1) & 0xFF]) & 0xFF] % 12;
  const d13 = corner_noise(n7, d8, d4);
  const d14 = corner_noise(n8, d9, d10);
  const d15 = corner_noise(n9, d11, d12);
  return 70.0 * (d13 + d14 + d15);
}

function get_flower(x, z) {
  return FLOWERS[
    Math.floor(
      Math.max(0.0, Math.min(0.9999, (1.0 + sample(x / 48.0, z / 48.0)) / 2.0)) *
        FLOWERS.length
    )
  ];
}

function update() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  let x_offset = parseInt(document.getElementById('x_offset').value);
  let z_offset = parseInt(document.getElementById('z_offset').value);
  for (let z = 0; z < canvas.width; z += 16) {
    for (let x = 0; x < canvas.height; x += 16) {
      ctx.drawImage(get_flower(x / 16 + x_offset, z / 16 + z_offset), z, x)
    }
  }
}

window.addEventListener('load', function () {
    update();
})
