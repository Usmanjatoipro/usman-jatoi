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
      if (file.endsWith(".ts") || file.endsWith(".tsx") || file.endsWith(".json") || file.endsWith(".txt")) {
        results.push(fullPath);
      }
    }
  });
  return results;
}

const files = getAllFiles("./src").concat(getAllFiles("./public"));

let replacedCount = 0;
files.forEach((f) => {
  if (f.includes("previewAuthStorage.ts")) return; // internal dev helper
  let content = fs.readFileSync(f, "utf8");
  let modified = false;

  if (content.includes("https://usman-connects-us.lovable.app")) {
    content = content.replaceAll("https://usman-connects-us.lovable.app", "https://usmanjatoi.com");
    modified = true;
  }
  if (content.includes("https://usmanjatoi.lovable.app")) {
    content = content.replaceAll("https://usmanjatoi.lovable.app", "https://usmanjatoi.com");
    modified = true;
  }
  if (content.includes("http://usmanjatoi.lovable.app")) {
    content = content.replaceAll("http://usmanjatoi.lovable.app", "https://usmanjatoi.com");
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(f, content, "utf8");
    console.log(`✓ Cleaned domain in: ${f}`);
    replacedCount++;
  }
});

console.log(`Total files cleaned: ${replacedCount}`);
