export const resolvers = {
  User: {
    note: (parent: any) => {
      console.log('User.note field resolver called with parent:', JSON.stringify(parent, null, 2));
      return parent.note;
    }
  },
  Query: {
    me: (_parent: any, _args: any, context: any) => {
      console.log('me query called');
      return {
        id: context.user.id,
        name: "tester",
        role: "TESTER",
        note: "Test note",
        adminNote: null
      };
    },
    user: (_parent: any, { id }: { id: number }) => {
      console.log('user query called with id:', id);
      const mockUsers = [
        {
          id: 1,
          name: "admin",
          role: "ADMIN",
          note: "CTF{GQL_P0CALYPSE_1337}",
          adminNote: "Admin secret data"
        },
        {
          id: 2,
          name: "alice", 
          role: "TESTER",
          note: "Alice here",
          adminNote: null
        }
      ];
      return mockUsers.find(u => u.id === id) || null;
    }
  },
  Mutation: {
    // ★ 脆弱ポイント: 任意 userId を受け入れてしまう
    createFeedback: async (_parent: any, { message, userId }: { message: string; userId: number }) => {
      console.log('=== createFeedback CALLED ===');
      console.log('message:', message);
      console.log('userId:', userId);
      
      // CTF用: データベース権限問題回避のため、直接的なレスポンスを返す
      const mockUsers = [
        {
          id: 1,
          name: "admin",
          role: "ADMIN",
          note: "CTF{GQL_P0CALYPSE_1337}",
          adminNote: "Admin secret data"
        },
        {
          id: 2,
          name: "alice", 
          role: "TESTER",
          note: "Alice here",
          adminNote: null
        }
      ];

      const user = mockUsers.find(u => u.id === userId) || mockUsers[0];
      console.log('Found user before return:', JSON.stringify(user, null, 2));
      
      const result = {
        id: Date.now(), // mock feedback ID
        message,
        user
      };
      console.log('Final result before return:', JSON.stringify(result, null, 2));
      return result;
    }
  }
};