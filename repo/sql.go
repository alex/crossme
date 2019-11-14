package repo

import "database/sql"

const sql_init = `
CREATE TABLE IF NOT EXISTS config (
  proto blob not null
);

CREATE TABLE IF NOT EXISTS puzzles (
  proto blob not null,
  title text not null,
  meta__sha256 text null unique,
  meta__id text unique not null primary key,
  meta__date text not null,
  meta__created text not null
);

CREATE INDEX IF NOT EXISTS puzzles__date ON puzzles (meta__date);

CREATE TABLE IF NOT EXISTS puz_files (
  sha256 text unique primary key,
  file blob
);
`

const sql_insert_puz_file = `
REPLACE INTO puz_files(sha256, file) VALUES (:sha256, :blob)
`

type insert_puz_file_args struct {
	Sha256 string `db:"sha256"`
	Blob   []byte `db:"blob"`
}

const sql_insert_puzzle = `
INSERT INTO puzzles (proto, title, meta__id, meta__sha256, meta__date, meta__created)
VALUES (:proto, :title, :id, :sha256, :date, :created)
`

type insert_puzzle_args struct {
	Proto   []byte         `db:"proto"`
	Title   string         `db:"title"`
	Id      string         `db:"id"`
	Sha256  sql.NullString `db:"sha256"`
	Date    string         `db:"date"`
	Created string         `db:"created"`
}

const sql_query_puzzle_index = `
SELECT meta__id as id, title, meta__date as date
FROM puzzles
ORDER BY date DESC
`

type PuzzleIndex struct {
	Id    string `db:"id"`
	Title string `db:"title"`
	Date  string `db:"date"`
}

const sql_query_puzzle_by_id = `
SELECT proto
FROM puzzles
WHERE meta__id = :id
`

type query_puzzle_by_id_args struct {
	Id string `db:"id"`
}

const sql_query_id_by_hash = `
SELECT meta__id as id
FROM puzzles
WHERE meta__sha256 = :sha256
`

type query_id_by_hash_args struct {
	Sha256 string `db:"sha256"`
}
