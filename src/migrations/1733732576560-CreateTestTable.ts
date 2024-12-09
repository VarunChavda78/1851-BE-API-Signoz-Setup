import { MigrationInterface, QueryRunner,Table } from "typeorm";

export class CreateTestTable1733732576560 implements MigrationInterface {
    name = 'CreateTestTable1733732576560'

    public async up(queryRunner: QueryRunner): Promise<void> {
       
        await queryRunner.createTable( 
            new Table({
            name: "test", // Table name
            columns: [
                {
                    name: "id",
                    type: "serial",
                    isPrimary: true,
                },
                {
                    name: "firstName",
                    type: "varchar",
                    length: "100",
                    isNullable: false,
                },
                {
                    name: "lastName",
                    type: "varchar",
                    length: "100",
                    isNullable: false,
                },
            ],
        }),
    );
}


    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("test");
    }

}
