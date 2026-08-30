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
  tableName: 'sell_requests',
  timestamps: true,
})
export class SellRequest extends Model<SellRequest> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare homeAddress: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare sellTimeline: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare estimatedPrice: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare propertyType: string;

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
    allowNull: false,
  })
  declare phoneNumber: string;

  // The catalog property this request claims (sell flow); used by the
  // admin verification step to transfer ownership to the claimant.
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  declare propertyId: string | null;

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





