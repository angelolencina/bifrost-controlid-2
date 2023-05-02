export default interface ControlidApiInterface {
  createUserQrCode(userId: number): Promise<any>;
  syncUser(userId: number): Promise<any>;
  syncAll(): Promise<any>;
}
