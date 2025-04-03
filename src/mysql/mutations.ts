export const INSERT_USER_STATEMENT = `
INSERT INTO users
(name, email, password)
VALUES(?,?,?)`
export const DELETE_USER_STATEMENT = `
DELETE FROM users WHERE id=?`
