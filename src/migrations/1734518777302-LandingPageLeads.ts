import { MigrationInterface, QueryRunner,Table } from "typeorm";

export class LandingPageLeads1734518777302 implements MigrationInterface {
    name = 'LandingPageLeads1734518777302'

    public async up(queryRunner: QueryRunner): Promise<void> {
        const landingPageLeadsExists = await queryRunner.hasTable('landing_page_leads');
        if (!landingPageLeadsExists) {
        await queryRunner.createTable(
            new Table({
                name: 'landing_page_leads',
                columns: [
                    {
                        name: 'id',
                        type: 'serial',
                        isPrimary: true,
                       
                    },
                    {
                        name: 'brandId',
                        type: 'int',
                        isNullable: false,
                    },
                    {
                        name: 'firstName',
                        type: 'varchar',
                        length: '255',
                        isNullable: false,
                    },
                    {
                        name: 'lastName',
                        type: 'varchar',
                        length: '255',
                        isNullable: false,
                    },
                    {
                        name: 'email',
                        type: 'varchar',
                        length: '255',
                        isNullable: false,
                    },
                    {
                        name: 'phone',
                        type: 'varchar',
                        length: '20',
                        isNullable: true,
                    },
                    {
                        name: 'city',
                        type: 'varchar',
                        length: '100',
                        isNullable: true,
                    },
                    {
                        name: 'state',
                        type: 'varchar',
                        length: '100',
                        isNullable: true,
                    },
                    {
                        name: 'zip',
                        type: 'varchar',
                        length: '20',
                        isNullable: true,
                    },
                    {
                        name: 'interest',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'createdAt',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                        isNullable: false,
                    },
                ],
            })
        );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('landing_page_leads');   
    }

}
