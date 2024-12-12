import { MigrationInterface, QueryRunner ,Table,TableForeignKey} from "typeorm";

export class LandingPageSectionsAndTemplates1733904635649 implements MigrationInterface {
    name = 'LandingPageSectionsAndTemplates1733904635649'

    public async up(queryRunner: QueryRunner): Promise<void> {
       
                // ==== landing_page_section ====
                const landingPageSectionExists = await queryRunner.hasTable('landing_page_section');
                if (!landingPageSectionExists) {
                    await queryRunner.createTable(new Table({
                        name: 'landing_page_section',
                        columns: [
                            {
                                name: 'id',
                                type: "serial", 
                                isPrimary: true,
                            },
                            {
                                name: 'name',
                                type: 'varchar',
                                length: '255',
                                isNullable: false,
                            },
                            {
                                name: 'slug',
                                type: 'varchar',
                                length: '255',
                                isNullable: false,
                                isUnique: true,
                            },
                        ],
                    }), true);
        
                    await queryRunner.query(`
                        INSERT INTO landing_page_section (name, slug)
                        VALUES 
                        ('Header', 'header'),
                        ('Hero', 'hero'),
                        ('Hero Call Out', 'hero-call-out'),
                        ('Hero Call Out', 'hero-franchise-story'),
                        ('Hero Call Out', 'hero-form'),
                        ('About Us', 'about-us'),
                        ('Services', 'services'),
                        ('Buying A Franchise', 'buy-a-franchise'),
                        ('Process', 'process'),
                        ('What Is Franchising', 'what-is-franchise'),
                        ('Franchise Opportunity', 'franchise-opportunity'),
                        ('Connect Call Out', 'connect-call-out'),
                        ('Footer', 'footer'),
                        ('T1P2-Header', 't1p2-header'),
                        ('T1P3-Header', 't1p3-header');
                    `);
                }
        
                // ==== landing_templates ====
                const landingPageTemplatesExists = await queryRunner.hasTable('landing_templates');
                if (!landingPageTemplatesExists) {
                    await queryRunner.createTable(new Table({
                        name: "landing_templates",
                        columns: [
                            {
                                name: "id",
                                type: 'serial', // PostgreSQL-compatible auto-increment
                                isPrimary: true,
                            },
                            {
                                name: "name",
                                type: "varchar",
                                length: "255",
                                isNullable: false,
                                isUnique: true 
                            },
                            {
                                name: "createdBy",
                                type: "int",
                                isNullable: false
                            },
                            {
                                name: "updatedBy",
                                type: "int",
                                isNullable: false
                            },
                            {
                                name: "createdAt",
                                type: "timestamp",
                                default: "CURRENT_TIMESTAMP"
                            },
                            {
                                name: "updatedAt",
                                type: "timestamp",
                                default: "CURRENT_TIMESTAMP"
                            }
                        ]
                    }), true);
        
                    await queryRunner.query(`
                       INSERT INTO landing_templates ("name", "createdBy", "updatedBy")
                        VALUES ('template1', 1, 1), ('template2', 1, 1), ('template3', 1, 1)
                        ON CONFLICT ("name") DO UPDATE SET "createdBy" = EXCLUDED."createdBy", "updatedBy" = EXCLUDED."updatedBy";
                    `);
                }
        
                // ==== landing_pages ====
                const landingPagesExists = await queryRunner.hasTable('landing_pages');
                if (!landingPagesExists) {
                    await queryRunner.createTable(new Table({
                        name: "landing_pages",
                        columns: [
                            {
                                name: "id",
                                type: "serial", 
                                isPrimary: true,
                            },
                            {
                                name: "templateId",
                                type: "int",
                                isNullable: false
                            },
                            {
                                name: "name",
                                type: "varchar",
                                length: "255",
                                isNullable: false,
                                
                            },
                            {
                                name: "sequence",
                                type: "int",
                                isNullable: false
                            },
                            {
                                name: "createdBy",
                                type: "int",
                                isNullable: false
                            },
                            {
                                name: "updatedBy",
                                type: "int",
                                isNullable: false
                            },
                            {
                                name: "createdAt",
                                type: "timestamp",
                                default: "CURRENT_TIMESTAMP"
                            },
                            {
                                name: "updatedAt",
                                type: "timestamp",
                                default: "CURRENT_TIMESTAMP"
                            }
                        ],
                        foreignKeys: [
                            new TableForeignKey({
                                columnNames: ["templateId"],
                                referencedColumnNames: ["id"],
                                referencedTableName: "landing_templates",
                                onDelete: "CASCADE"
                            })
                        ],
                        uniques: [
                            {
                                name: 'UQ_template_page_name',
                                columnNames: ['templateId', 'name']
                            }
                        ]
                    }), true);
        
                    await queryRunner.query(`
                        INSERT INTO landing_pages ("templateId", "name", "sequence", "createdBy", "updatedBy")
                        VALUES 
                        (1, 'home', 1, 1, 1),
                        (1, 'services', 2, 1, 1),
                        (1, 'what-is-franchising', 3, 1, 1),
                        (1, 'meet-the-team', 4, 1, 1),
                        (2, 'home', 1, 1, 1),
                        (3, 'home', 1, 1, 1)
                        ON CONFLICT ("templateId","name") DO UPDATE SET "templateId" = EXCLUDED."templateId", "sequence" = EXCLUDED."sequence", "createdBy" = EXCLUDED."createdBy", "updatedBy" = EXCLUDED."updatedBy";
                    `);
                }
                 
        }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('landing_pages', true);
        await queryRunner.dropTable('landing_templates', true);
        await queryRunner.dropTable('landing_page_section', true);
    }
}
