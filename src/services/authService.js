const mockApiData = {
  "pegawai@opd.go.id": {
    token: "jwt.token.pegawai",
    user: {
      id: 1,
      name: "Budi Pegawai",
      email: "pegawai@opd.go.id",
      role: { id: 1, name: "pegawai_opd" },
      permissions: [],
    },
  },
  "teknisi@siladan.go.id": {
    token: "jwt.token.teknisi",
    user: {
      id: 2,
      name: "Ani Teknisi",
      email: "teknisi@siladan.go.id",
      role: { id: 2, name: "teknisi" },
      permissions: [
        { action: "read", subject: "ticket" },
        { action: "update", subject: "self_ticket" },
      ],
    },
  },
  "seksi@siladan.go.id": {
    token: "jwt.token.seksi",
    user: {
      id: 4,
      name: "Doni Seksi",
      email: "seksi@siladan.go.id",
      role: { id: 4, name: "seksi" },
      permissions: [
        { action: "read", subject: "ticket" },
        { action: "assign", subject: "ticket" },
      ],
    },
  },
  "admin@kota.go.id": {
    token: "jwt.token.admin",
    user: {
      id: 3,
      name: "Charlie Admin",
      email: "admin@kota.go.id",
      role: { id: 3, name: "admin_kota" },
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
