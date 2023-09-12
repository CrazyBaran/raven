import { config } from "dotenv";
import { DataSource } from "typeorm";

config();

import dbConfig from "./orm-config.cli";


export const AppDataSource = new DataSource(dbConfig);
