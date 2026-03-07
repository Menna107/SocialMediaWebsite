export interface Notification {
  _id: string;
  recipient: Recipient;
  actor: Recipient;
  type: string;
  entityType: string;
  entityId: string;
  isRead: boolean;
  createdAt: string;
  entity: Entity;
}

interface Entity {
  _id: string;
  unavailable: boolean;
}

interface Recipient {
  _id: string;
  name: string;
  photo: string;
}
