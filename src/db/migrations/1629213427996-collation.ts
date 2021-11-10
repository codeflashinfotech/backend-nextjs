import { MigrationInterface, QueryRunner } from 'typeorm';

export class collation1629213427996 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER DATABASE pantryondb CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;',
    );

    const tables = await queryRunner.getTables();
    for (const table of tables) {
      if (
        !table.name.includes('information_schema') &&
        !table.name.includes('ShoppingListProductsView') &&
        !table.name.includes('mysql') &&
        !table.name.includes('performance_schema')
      ) {
        await queryRunner.query(
          `ALTER TABLE \`${table.name}\` CONVERT TO CHARACTER SET utf8mb4 COLLATE 'utf8mb4_unicode_ci';`,
        );

        for (const column of table.columns) {
          if (column.type == 'CHAR' || column.type == 'VARCHAR') {
            await queryRunner.query(
              `ALTER TABLE \`${table.name}\` ALTER \`${column.name}\` DROP DEFAULT;
              ALTER TABLE \`${table.name}\` CHANGE COLUMN \`${column.name}\` \`${column.name}\`  ${column.type}(${column.length}) COLLATE 'utf8mb4_unicode_ci';`,
            );
          }
          if (column.type.includes('TEXT')) {
            await queryRunner.query(
              `ALTER TABLE \`${table.name}\` CHANGE COLUMN \`${column.name}\` \`${column.name}\`  ${column.type} COLLATE 'utf8mb4_unicode_ci';`,
            );
          }
        }
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
