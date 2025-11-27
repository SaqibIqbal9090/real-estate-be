import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from '../users/user.model';

@Table({
  tableName: 'buy_requests',
  timestamps: true,
})
export class BuyRequest extends Model<BuyRequest> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  bedrooms?: string;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: true,
  })
  budget?: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  city?: string;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  neighborhoods?: string[];

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  workLocation?: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  commuteRadius?: number;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  features?: string[];

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  pets?: string[];

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  priority?: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  moveDate?: Date;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  moveUrgency?: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  duration?: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  roommates?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  creditScore?: string;

  // Relationships
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare userId: string;

  @BelongsTo(() => User)
  user: User;

  // Timestamps
  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}

