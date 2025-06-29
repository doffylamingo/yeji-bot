process.env.NODE_ENV ??= "development";

import {
  ApplicationCommandRegistries,
  RegisterBehavior,
} from "@sapphire/framework";
import "@sapphire/plugin-logger/register";
import { join } from "node:path";
import { setup } from "@skyra/env-utilities";
import * as colorette from "colorette";
import { srcDir } from "./constants";

ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(
  RegisterBehavior.BulkOverwrite,
);

setup({ path: join(srcDir, "../.env") });

colorette.createColors({ useColor: true });
