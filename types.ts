
export type Player = 'X' | 'O';

export interface Card {
  id: number;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
  owner: Player | null;
}

export interface GameState {
  board: Card[];
  currentPlayer: Player;
  flippedCards: number[];
  winner: Player | 'Draw' | null;
  scores: { X: number; O: number };
}

// Added Camera interface to fix import errors in CameraGrid.tsx and CameraFeed.tsx
export interface Camera {
  id: string;
  name: string;
  thumbnail: string;
  status: 'online' | 'offline';
  provider?: string;
  protocol: string;
  isRecording?: boolean;
  hasMotion?: boolean;
  ip?: string;
  location: string;
}

// Added IntegrationSession interface to fix import errors in SettingsModal.tsx
export interface IntegrationSession {
  id: string;
  providerId: string;
  providerName: string;
  username: string;
  cameraCount: number;
}

// Added Attachment, Installment and Loan interfaces to fix import errors in Finance/Loan components
export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  data: string;
  uploadDate: string;
}

export interface Installment {
  id: string;
  number: number;
  value: number;
  dueDate: string;
  status: 'paid' | 'unpaid';
}

export interface Loan {
  id: string;
  customer: {
    name: string;
    document?: string;
    phone?: string;
  };
  amount: number;
  interestRate: number;
  installmentsCount: number;
  installments: Installment[];
  startDate: string;
  dueDay: number;
  status: 'active' | 'completed';
  collateralType: string;
  collateralDescription?: string;
  attachments: Attachment[];
  totalToPay: number;
}
