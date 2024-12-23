import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateLPMasterTable1734936374132 implements MigrationInterface {
  name = 'CreateLPTable1734936374132';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const lPTemplatesExists = await queryRunner.hasTable('lp_templates');
    if (!lPTemplatesExists) {
      await queryRunner.createTable(
        new Table({
          name: 'lp_templates',
          columns: [
            {
              name: 'id',
              type: 'serial',
              isPrimary: true,
            },
            {
              name: 'name',
              type: 'varchar',
              length: '255',
              isNullable: false,
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
            {
              name: 'createdAt',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP',
            },
            {
              name: 'updatedAt',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP',
            },
          ],
        }),
        true,
      );

      await queryRunner.query(`
                   INSERT INTO lp_templates ("name", "createdBy", "updatedBy")
                    VALUES ('Template 1', 1, 1), ('Template 2', 1, 1), ('Template 3', 1, 1)
                `);
    }

    const lPTemplatePagesExists =
      await queryRunner.hasTable('lp_template_pages');
    if (!lPTemplatePagesExists) {
      await queryRunner.createTable(
        new Table({
          name: 'lp_template_pages',
          columns: [
            {
              name: 'id',
              type: 'serial',
              isPrimary: true,
            },
            {
              name: 'templateId',
              type: 'int',
              isNullable: false,
            },
            {
              name: 'name',
              type: 'varchar',
              length: '255',
              isNullable: false,
            },
            {
              name: 'sequence',
              type: 'int',
              isNullable: false,
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
            {
              name: 'createdAt',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP',
            },
            {
              name: 'updatedAt',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP',
            },
          ],
        }),
        true,
      );

      await queryRunner.query(`
        INSERT INTO lp_template_pages ("templateId", "name", "sequence", "createdBy", "updatedBy")
        VALUES 
        (1, 'Home', 1, 1, 1),
        (1, 'Services', 2, 1, 1),
        (1, 'What is Franchising', 3, 1, 1),
        (1, 'Meet he Team', 4, 1, 1),
        (2, 'Home', 1, 1, 1),
        (3, 'Home', 1, 1, 1)
    `);
    }
    const lpSectionExists = await queryRunner.hasTable('lp_sections');
    if (!lpSectionExists) {
      await queryRunner.createTable(
        new Table({
          name: 'lp_sections',
          columns: [
            {
              name: 'id',
              type: 'serial',
              isPrimary: true,
            },
            {
              name: 'lpTemplatePageId',
              type: 'int',
              isNullable: false,
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
         
        }),
        true,
      );
      await queryRunner.query(`
        INSERT INTO lp_sections (id,"lpTemplatePageId", name, slug)
        VALUES 
        (1,1,'Header', 'header'),
        (2,1,'Hero', 'hero'),
        (3,1,'Hero Call Out', 'hero-call-out'),
        (4,1,'Hero Call Out', 'hero-franchise-story'),
        (5,1,'Hero Call Out', 'hero-form'),
        (6,1,'About Us', 'about-us'),
        (7,1,'Services', 'services'),
        (8,1,'Buying A Franchise', 'buy-a-franchise'),
        (9,1,'Process', 'process'),
        (10,1,'What Is Franchising', 'what-is-franchise'),
        (11,1,'Franchise Opportunity', 'franchise-opportunity'),
        (12,1,'Connect Call Out', 'connect-call-out'),
        (13,1,'Footer', 'footer'),
        (14,2,'T1P2-Header', 't1p2-header'),
        (15,3,'T1P3-Header', 't1p3-header'),
        (16,2,'T1P2 Footer', 't1p2-footer'),
        (18,3,'T1P3 Footer', 't1p3-footer'),
        (19,2,'T1P2 Connect Call Out', 't1p2-connect-call-out'),
        (20,3,'T1P3 Connect Call Out', 't1p3-connect-call-out'),
        (21,3,'T1P3 Hero', 't1p3-hero'),
        (22,2,'T1P2 Services', 't1p2-services'),
        (23,3,'T1P3 Franchise Opportunity', 't1p3-franchise-opportunity'),
        (24,3,'T1P3 Franchise Research', 't1p3-franchise-research'),
        (25,2,'T1P2 About Services', 't1p2-about-services'),
        (26,2,'T1P2 How We Help', 't1p2-how-we-help'),
        (27,3,'T1P3 Franchise List', 't1p3-franchise-list'),
        (28,2,'T1P2 Industries', 't1p2-industries'),
        (29,2,'T1P2 Franchise Opportunities', 't1p2-franchise-opportunities'),
        (30,2,'T1P2 Faq List', 't1p2-faq-list'),
        (31,4,'T1P4 Header', 't1p4-header'),
        (32,4,'T1P4 Hero', 't1p4-hero'),
        (33,4,'T1P4 Team List', 't1p4-team-list'),
        (34,4,'T1P4 Franchise Opportunity', 't1p4-franchise-opp'),
        (35,4,'T1P4 Connect Call Out', 't1p4-connect-call-out'),
        (36,4,'T1P4 Footer', 't1p4-footer'),
        (37,5, 'T2 Header', 't2-header'),
        (38,5, 'T2 Hero', 't2-hero'),
        (39,5, 'T2 Why Us', 't2-why-us'),
        (40,5, 'T2 Own Form', 't2-own-form'),
        (41,5, 'T2 Franchise University', 't2-franchise-university'),
        (42,5, 'T2 Quick Facts', 't2-quick-facts'),
        (43,5, 'T2 About Us', 't2-about-us'),
        (44,5, 'T2 Call Out', 't2-call-out'),
        (45,5, 'T2 Franchise Testimonial', 't2-franchise-testimonial'),
        (46,5, 'T2 Market Availability', 't2-market-availability'),
        (47,5, 'T2 Connect Call Out', 't2-connect-call-out'),
        (48,5, 'T2 Franchise Opportunity', 't2-franchise-Opp'),
        (49,5, 'T2 Footer', 't2-footer'),
        (50,1, 'T1P1 Meta', 't1p1-meta'),
        (51,2, 'T1P2 Meta', 't1p2-meta'),
        (52,3, 'T1P3 Meta', 't1p3-meta'),
        (53,4, 'T1P4 Meta', 't1p4-meta')
        ON CONFLICT (slug) DO NOTHING;
    `);
    }
    // LP pages
    const lPPagesExists = await queryRunner.hasTable('lp_pages');
    if (!lPPagesExists) {
      await queryRunner.createTable(
        new Table({
          name: 'lp_pages',
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
              name: 'templateId',
              type: 'int',
              isNullable: false,
            },
            {
              name: 'name',
              type: 'varchar',
              length: '255',
              isNullable: false,
            },
            {
              name: 'brandSlug',
              type: 'varchar',
              length: '255',
              isNullable: false,
            },
            {
              name: 'status',
              type: 'int',
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
              name: 'customDomainStatus',
              type: 'varchar',
              length: '255',
              isNullable: true,
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
            {
              name: 'createdAt',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP',
            },
            {
              name: 'updatedAt',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP',
            },
            {
              name: 'deletedAt',
              type: 'timestamp',
              isNullable: true,
            },
          ],
        }),
        true,
      );
    }
    const lPStatus = await queryRunner.hasTable('lp_status');
    if (!lPStatus) {
      await queryRunner.createTable(
        new Table({
          name: 'lp_status',
          columns: [
            {
              name: 'id',
              type: 'serial',
              isPrimary: true,
            },
            {
              name: 'landingPageId',
              type: 'int',
              isNullable: false,
            },
            {
              name: 'status',
              type: 'int',
              isNullable: false,
            },

            {
              name: 'createdBy',
              type: 'int',
              isNullable: false,
            },

            {
              name: 'createdAt',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP',
            },
          ],
        }),
        true,
      );
    }
    const lPDomain = await queryRunner.hasTable('lp_domain_history');
    if (!lPDomain) {
      await queryRunner.createTable(
        new Table({
          name: 'lp_domain_history',
          columns: [
            {
              name: 'id',
              type: 'serial',
              isPrimary: true,
            },
            {
              name: 'landingPageId',
              type: 'int',
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
              name: 'createdBy',
              type: 'int',
              isNullable: false,
            },

            {
              name: 'createdAt',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP',
            },
          ],
        }),
        true,
      );
    }
    const lPCustomisation = await queryRunner.hasTable('lp_customisation');
    if (!lPCustomisation) {
      await queryRunner.createTable(
        new Table({
          name: 'lp_customisation',
          columns: [
            {
              name: 'id',
              type: 'serial',
              isPrimary: true,
            },
            {
              name: 'landingPageId',
              type: 'int',
              isNullable: false,
            },
            {
              name: 'sectionId',
              type: 'int',
              isNullable: false,
            },
            {
              name: 'content',
              type: 'json',
              isNullable: false,
            },
            {
              name: 'createdAt',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP',
            },
            {
              name: 'updatedAt',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP',
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
        }),
        true,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    //
  }
}
