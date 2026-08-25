import fs from "fs";
import path from "path";

function getAllFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      if (!file.startsWith(".") && file !== "node_modules") {
        results = results.concat(getAllFiles(fullPath));
      }
    } else {
      if (file.endsWith(".ts") || file.endsWith(".tsx")) {
        results.push(fullPath);
      }
    }
  });
  return results;
}

const files = getAllFiles("./src");
console.log("=== SCANNING FOR REDIRECTS AND TRAILING SLASH HANDLING ===");
files.forEach((f) => {
  const content = fs.readFileSync(f, "utf8");
  if (content.includes("throw redirect(") || content.includes("redirect({")) {
    console.log(`Redirect found in: ${f}`);
    const lines = content.split("\n");
    lines.forEach((line, idx) => {
      if (line.includes("redirect(")) {
        console.log(`  Line ${idx + 1}: ${line.trim()}`);
      }
    });
  }
});
