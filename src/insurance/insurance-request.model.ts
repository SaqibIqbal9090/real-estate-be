import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';

export type InsuranceType = 'home' | 'auto';

@Table({
  tableName: 'insurance_requests',
  timestamps: true,
})
export class InsuranceRequest extends Model<InsuranceRequest> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  // 'home' | 'auto'
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare type: InsuranceType;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare fullName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  phoneNumber?: string;

  // All step answers for the form (shape differs for home vs auto)
  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  details?: Record<string, any>;

  // Lead lifecycle: new | contacted | quoted | closed
  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: 'new',
  })
  declare status: string;

  // Timestamps
  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}
