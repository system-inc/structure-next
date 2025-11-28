// Class - SessionManager
class SessionManager {
    private visitId: string | null = null;
    private visitStartAt: Date | null = null;
    private lastActivityAt: Date | null = null;
    private readonly sessionTimeoutInMilliseconds = 30 * 60 * 1000; // 30 minutes

    initializeSession(): void {
        if(this.visitId === null || this.visitStartAt === null || this.lastActivityAt === null) {
            this.createNewVisit();
        }
    }

    private createNewVisit(): void {
        // Generate a unique visit ID using browser crypto API
        this.visitId = crypto.randomUUID();
        const now = new Date();
        this.visitStartAt = now;
        this.lastActivityAt = now;
    }

    private checkAndResetSession(): void {
        // If no session exists, create one
        if(this.lastActivityAt === null) {
            this.createNewVisit();
            return;
        }

        // Check if 30 minutes have passed since last activity
        const timeSinceLastActivity = Date.now() - this.lastActivityAt.getTime();
        if(timeSinceLastActivity > this.sessionTimeoutInMilliseconds) {
            this.createNewVisit();
        }
        else {
            // Update last activity time to track ongoing activity
            this.lastActivityAt = new Date();
        }
    }

    getVisitId(): string {
        this.checkAndResetSession();
        return this.visitId!;
    }

    getVisitStartAt(): string {
        this.checkAndResetSession();
        return this.visitStartAt!.toISOString();
    }

    resetSession(): void {
        this.createNewVisit();
    }
}

// Export singleton instance
export const sessionManager = new SessionManager();
