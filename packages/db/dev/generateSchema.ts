import path from "path";
import * as schema from "../src/schema";
import { pgGenerate } from "drizzle-dbml-generator";

const out = path.join("docs", "schema.dbml");
const relational = true;

pgGenerate({schema, out, relational});
