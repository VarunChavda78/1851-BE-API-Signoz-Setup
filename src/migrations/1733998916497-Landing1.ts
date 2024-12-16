import { MigrationInterface, QueryRunner ,Table,TableForeignKey} from "typeorm";

export class Landing11733998916497 implements MigrationInterface {
    name = 'Landing11733998916497'

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
                 INSERT INTO landing_page_section (id,name, slug)
                 VALUES 
                 (1,'Header', 'header'),
                 (2,'Hero', 'hero'),
                 (3,'Hero Call Out', 'hero-call-out'),
                 (4,'Hero Call Out', 'hero-franchise-story'),
                 (5,'Hero Call Out', 'hero-form'),
                 (6,'About Us', 'about-us'),
                 (7,'Services', 'services'),
                 (8,'Buying A Franchise', 'buy-a-franchise'),
                 (9,'Process', 'process'),
                 (10,'What Is Franchising', 'what-is-franchise'),
                 (11,'Franchise Opportunity', 'franchise-opportunity'),
                 (12,'Connect Call Out', 'connect-call-out'),
                 (13,'Footer', 'footer'),
                 (14,'T1P2-Header', 't1p2-header'),
                 (15,'T1P3-Header', 't1p3-header'),
                 (16,'T1P2 Footer', 't1p2-footer'),
                 (18,'T1P3 Footer', 't1p3-footer'),
                 (19,'T1P2 Connect Call Out', 't1p2-connect-call-out'),
                 (20,'T1P3 Connect Call Out', 't1p3-connect-call-out'),
                 (21,'T1P3 Hero', 't1p3-hero'),
                 (22,'T1P2 Services', 't1p2-services'),
                 (23,'T1P3 Franchise Opportunity', 't1p3-franchise-opportunity'),
                 (24,'T1P3 Franchise Research', 't1p3-franchise-research'),
                 (25,'T1P2 About Services', 't1p2-about-services'),
                 (26,'T1P2 How We Help', 't1p2-how-we-help'),
                 (27,'T1P3 Franchise List', 't1p3-franchise-list'),
                 (28,'T1P2 Industries', 't1p2-industries'),
                 (29,'T1P2 Franchise Opportunities', 't1p2-franchise-opportunities'),
                 (30,'T1P2 Faq List', 't1p2-faq-list'),
                 (31,'T1P4 Header', 't1p4-header'),
                 (32,'T1P4 Hero', 't1p4-hero'),
                 (33,'T1P4 Team List', 't1p4-team-list'),
                 (34,'T1P4 Franchise Opportunity', 't1p4-franchise-opp'),
                 (35,'T1P4 Connect Call Out', 't1p4-connect-call-out'),
                 (36,'T1P4 Footer', 't1p4-footer'),
                 (37, 'T2 Header', 't2-header'),
                 (38, 'T2 Hero', 't2-hero'),
                 (39, 'T2 Why Us', 't2-why-us'),
                 (40, 'T2 Own Form', 't2-own-form'),
                 (41, 'T2 Franchise University', 't2-franchise-university'),
                 (42, 'T2 Quick Facts', 't2-quick-facts'),
                 (43, 'T2 About Us', 't2-about-us'),
                 (44, 'T2 Call Out', 't2-call-out'),
                 (45, 'T2 Franchise Testimonial', 't2-franchise-testimonial'),
                 (46, 'T2 Market Availability', 't2-market-availability'),
                 (47, 'T2 Connect Call Out', 't2-connect-call-out'),
                 (48, 'T2 Franchise Opportunity', 't2-franchise-Opp'),
                 (49, 'T2 Footer', 't2-footer')
                 ON CONFLICT (slug) DO NOTHING;
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
                         type: 'serial',
                         isPrimary: true,
                     },
                     {
                         name: "name",
                         type: "varchar",
                         length: "255",
                         isNullable: false,
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
             `);
         }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('landing_pages', true);
        await queryRunner.dropTable('landing_templates', true);
        await queryRunner.dropTable('landing_page_section', true);
    }

}
