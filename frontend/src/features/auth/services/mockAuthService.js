const mockApiData = {
  "pegawai@opd.go.id": {
    token: "jwt.token.pegawai",
    user: {
      id: 1,
      name: "Bisma Pargoy",
      nik: "1471070904020021",
      email: "pegawai@opd.go.id",
      phone_number: "+62895-6348-62009",
      address: "Rungkut Asri Timur, Surabaya",
      avatar: "https://i.pravatar.cc/150?u=pegawai@opd.go.id",
      opd: {
        name: "Sekretariat DPRD",
        value: "sekretariat_dprd",
        address: "Surabaya",
      },
      role: { id: 1, name: "pegawai_opd", label: "Pegawai" },
      permissions: [],
    },
  },
  "teknisi@siladan.go.id": {
    token: "jwt.token.teknisi",
    user: {
      id: 2,
      name: "Ani Teknisi",
      email: "teknisi@siladan.go.id",
      avatar: "https://i.pravatar.cc/150?u=teknisi@siladan.go.id",
      role: { id: 2, name: "teknisi", label: "Teknisi" },
      permissions: [
        { action: "read", subject: "dashboard" },
        { action: "process", subject: "ticket" },
        { action: "create", subject: "article" },
      ],
    },
  },
  "helpdesk@siladan12.go.id": {
    token: "jwt.token.helpdesk",
    user: {
      id: 4,
      name: "Chichi Helpdesk",
      email: "helpdesk@siladan.go.id",
      avatar: "https://i.pravatar.cc/150?u=teknisi@siladan.go.id",
      role: { id: 5, name: "helpdesk", label: "Helpdesk" },
      permissions: [
        { action: "read", subject: "dashboard" },
        { action: "create", subject: "ticket" },
        { action: "assign", subject: "ticket" },
        { action: "handle", subject: "chat" },
      ],
    },
  },
  "seksi@siladan.go.id": {
    token: "jwt.token.seksi",
    user: {
      id: 4,
      name: "Doni Seksi",
      email: "seksi@siladan.go.id",
      avatar: "https://i.pravatar.cc/150?u=teknisi@siladan.go.id",
      role: { id: 4, name: "seksi", label: "Seksi" },
      permissions: [
        { action: "read", subject: "dashboard" },
        { action: "approve", subject: "ticket" },
      ],
    },
  },
  "admin@kota.go.id": {
    token: "jwt.token.admin",
    user: {
      id: 3,
      name: "Charlie Admin",
      email: "admin@kota.go.id",
      avatar: "https://i.pravatar.cc/150?u=admin@kota.go.id",
      role: { id: 3, name: "admin_kota", label: "Admin Kota" },
      permissions: [{ action: "manage", subject: "all" }],
    },
  },
};

export const login = (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (mockApiData[email] && password === "password") {
        console.log("Login success for:", mockApiData[email].user.name);
        resolve(mockApiData[email]);
      } else {
        console.log("Login failed for email", email);
        reject(new Error("Email atau password salah"));
      }
    }, 1000);
  });
};
