import path from "path";
import { pgGenerate } from "drizzle-dbml-generator";

import * as schema from "../src/schema";

const out = path.join("docs", "schema.dbml");
const relational = true;

pgGenerate({ schema, out, relational });
