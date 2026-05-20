import { Schema, model, Document, Types } from 'mongoose';

export interface IProject extends Document {
  title: string;
  description: string;
  createdBy: Types.ObjectId;
  members: Types.ObjectId[];
  status: 'active' | 'completed' | 'on-hold';
  createdAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    status: {
      type: String,
      enum: ['active', 'completed', 'on-hold'],
      default: 'active',
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  }
);

export const Project = model<IProject>('Project', projectSchema);
