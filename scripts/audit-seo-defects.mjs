import fs from "fs";
import path from "path";

function getAllFiles(dir, exts = [".ts", ".tsx", ".js", ".mjs", ".txt"]) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      if (!file.startsWith(".") && file !== "node_modules" && file !== "dist") {
        results = results.concat(getAllFiles(fullPath, exts));
      }
    } else {
      if (exts.some((ext) => file.endsWith(ext))) {
        results.push(fullPath);
      }
    }
  });
  return results;
}

const allFiles = getAllFiles("./src").concat(getAllFiles("./public"));

console.log("=== SCANNING FOR LOVABLE.APP AND DEV DOMAINS ===");
let count = 0;
allFiles.forEach((f) => {
  const content = fs.readFileSync(f, "utf8");
  if (content.includes("lovable.app") || content.includes("lovableproject.com")) {
    console.log(`Found lovable domain in: ${f}`);
    count++;
  }
});
console.log(`Total files with lovable domain: ${count}`);

console.log("\n=== SCANNING FOR ROUTE FILES WITHOUT CANONICAL ===");
const routeFiles = getAllFiles("./src/routes", [".tsx", ".ts"]);
routeFiles.forEach((f) => {
  const content = fs.readFileSync(f, "utf8");
  const hasCanonical = content.includes('rel: "canonical"') || content.includes("rel: 'canonical'") || content.includes("canonical");
  const isComponentRoute = content.includes("createFileRoute");
  if (isComponentRoute && !hasCanonical && !f.includes(".xml") && !f.includes(".xsl") && !f.includes(".txt") && !f.includes("__root")) {
    console.log(`Missing canonical in route: ${f}`);
  }
});
