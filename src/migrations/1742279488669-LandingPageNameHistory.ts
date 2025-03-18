import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class LandingPageNameHistory1742279488669 implements MigrationInterface {
    name = 'LandingPageNameHistory1742279488669'

    public async up(queryRunner: QueryRunner): Promise<void> {
        const landingPageHistoryExists = await queryRunner.hasTable(
            'lp_name_history',
          );
          if(!landingPageHistoryExists){
            await queryRunner.createTable(
                new Table({
                  name: "lp_name_history",
                  columns: [
                    {
                      name: "id",
                      type: "serial", 
                      isPrimary: true,
                    },
                    {
                      name: "lpId",
                      type: "int",
                      isNullable: true,
                    },
                    {
                      name: "name",
                      type: "varchar",
                      length: "255",
                      isNullable: true, 
                    },
                    {
                      name: "nameSlug",
                      type: "varchar",
                      length: "255",
                      isNullable: true,
                    },
                    {
                      name: "createdAt",
                      type: "timestamp",
                      default: "CURRENT_TIMESTAMP", 
                    },
                    {
                      name: "updatedAt",
                      type: "timestamp",
                      default: "CURRENT_TIMESTAMP",
                     
                    },
                    {
                      name: "deletedAt",
                      type: "timestamp",
                      isNullable: true,
                    },
                    {
                      name: "createdBy",
                      type: "int",
                      isNullable: true,
                    },
                    {
                      name: "updatedBy",
                      type: "int",
                      isNullable: false,
                      default: 1
                    },
                  ],
                }),
                true
              );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("lp_name_history");
    
    }

}
