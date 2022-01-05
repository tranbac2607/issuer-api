create table if not exists certs (
    id integer auto_increment,
    student_id text,
    subject_id text,
    semester text,
    cert_id text,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp,
    deleted_at timestamp,
    deleted boolean default false
);