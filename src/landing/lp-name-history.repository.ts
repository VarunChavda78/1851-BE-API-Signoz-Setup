import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { LpNameHistory } from "./lp-name-history.entity";

@Injectable()
export class LpNameRepository extends Repository<LpNameHistory> {
  constructor(private dataSource: DataSource) {
    super(LpNameHistory, dataSource.createEntityManager());
  }
}
