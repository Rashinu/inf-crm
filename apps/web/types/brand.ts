export interface Brand {
    id: string;
    name: string;
    website?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
    _count?: {
        contacts: number;
        deals: number;
    };
}

export interface CreateBrandInput {
    name: string;
    website?: string;
    notes?: string;
}
