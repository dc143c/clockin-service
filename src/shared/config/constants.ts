export class Constants {
  public static readonly JWT_SECRET =
    process.env.JWT_SECRET || 'knowledgeistheway';
  public static readonly JWT_EXPIRATION_TIME = '1h';
  public static readonly DB_HOST =
    process.env.MYSQL_HOST || 'entrance-system-db';
  public static readonly DB_PORT = parseInt(process.env.MYSQL_PORT) || 3306;
  public static readonly DB_USERNAME = process.env.MYSQL_USER || 'user';
  public static readonly DB_PASSWORD = process.env.MYSQL_PASSWORD || 'password';
  public static readonly DB_DATABASE = process.env.MYSQL_DATABASE || 'db';
}
