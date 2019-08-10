export interface eventSchema {
    name: string,
    publicInvite: boolean,
    startDate?: Date,
    endDate?: Date,
    location?: string,
    description?: string,
    invited: string[]
}

export interface userSchema {
    firstName: string,
    lastName: string,
    avatar?: string
}