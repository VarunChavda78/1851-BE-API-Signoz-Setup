import { MigrationInterface, QueryRunner ,Table,TableCheck,TableForeignKey} from "typeorm";

export class LandingPageCustomisationAndPublish1733904657226 implements MigrationInterface {
    name = 'LandingPageCustomisationAndPublish1733904657226'

    public async up(queryRunner: QueryRunner): Promise<void> {
       
                // ==== landing_page_customisation ====
                const landingPageCustomisationExists = await queryRunner.hasTable('landing_page_customisation');
                if (!landingPageCustomisationExists) {
                    await queryRunner.createTable(new Table({
                        name: "landing_page_customisation",
                        columns: [
                            {
                                name: "id",
                                type: "serial", 
                                isPrimary: true,
                            },
                            {
                                name: "brandId",
                                type: "int",
                                isNullable: false,
                            },
                            {
                                name: "sectionId",
                                type: "int",
                                isNullable: false,
                            },
                            {
                                name: "content",
                                type: "jsonb",
                                isNullable: false,
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
                                name: "createdBy",
                                type: "int",
                                isNullable: false,
                            },
                            {
                                name: "updatedBy",
                                type: "int",
                                isNullable: false,
                            },
                            {
                                name: "pageId",
                                type: "int",
                                isNullable: true, // Initially nullable for existing data
                            },
                        ],
                        foreignKeys: [
                            new TableForeignKey({
                                columnNames: ["sectionId"],
                                referencedColumnNames: ["id"],
                                referencedTableName: "landing_page_section",
                                onDelete: "CASCADE",
                            }),
                            new TableForeignKey({
                                columnNames: ["pageId"],
                                referencedColumnNames: ["id"],
                                referencedTableName: "landing_pages",
                                onDelete: "CASCADE",
                            }),
                        ],
                    }), true);
                }
        
                // ==== landing_page_publish ====
                const landingPagePublishExists = await queryRunner.hasTable('landing_page_publish');
                if (!landingPagePublishExists) {
                    await queryRunner.createTable(new Table({
                        name: 'landing_page_publish',
                        columns: [
                            {
                                name: 'id',
                                type: 'serial', // PostgreSQL-compatible auto-increment
                                isPrimary: true,
                            },
                            {
                                name: 'brandId',
                                type: 'int',
                                isNullable: false,
                            },
                            {
                                name: 'brandSlug',
                                type: 'varchar',
                                length: '255',
                                isNullable: true,
                            },
                            {
                                name: 'status',
                                type: 'boolean',
                                isNullable: false,
                            },
                            {
                                name: 'domainType',
                                type: 'int',
                                isNullable: true,
                            },
                            {
                                name: 'domain',
                                type: 'varchar',
                                length: '255',
                                isNullable: true,
                            },
                            {
                                name: 'createdAt',
                                type: "timestamp",
                                default: "CURRENT_TIMESTAMP"
                            },
                            {
                                name: 'updatedAt',
                                type: "timestamp",
                                default: "CURRENT_TIMESTAMP"
                            },
                            {
                                name: 'createdBy',
                                type: 'int',
                                isNullable: false,
                            },
                            {
                                name: 'updatedBy',
                                type: 'int',
                                isNullable: false,
                            },
                        ],
                        checks: [
                            new TableCheck({
                                name: 'check_domain_type',
                                expression: `"domainType" IN (1, 2)`,
                            }),
                        ],
                    }), true);
                }
            
        }
        

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('landing_page_publish', true);
        await queryRunner.dropTable('landing_page_customisation', true);
    }

}
