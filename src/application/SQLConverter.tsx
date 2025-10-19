import React, { useState } from 'react';

// Helper functions
const capitalize = (str: string): string => {
    // Convert snake_case to PascalCase
    return str
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join('');
};

const toCamelCase = (str: string): string => {
    // Convert snake_case to camelCase
    const words = str.split('_');
    if (words.length === 1) {
        return str; // Already single word, keep as is
    }
    return words[0].toLowerCase() + words.slice(1)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join('');
};

const mapMySQLTypeToPrisma = (mysqlType: string): string => {
    // Remove content in parentheses and UNSIGNED keyword
    const type = mysqlType
        .replace(/\([^)]*\)/g, '')
        .replace(/UNSIGNED/gi, '')
        .trim()
        .toUpperCase();
    
    const typeMap: { [key: string]: string } = {
        'INT': 'Int',
        'INTEGER': 'Int',
        'TINYINT': 'Int',
        'SMALLINT': 'Int',
        'MEDIUMINT': 'Int',
        'BIGINT': 'BigInt',
        'DECIMAL': 'Decimal',
        'NUMERIC': 'Decimal',
        'FLOAT': 'Float',
        'DOUBLE': 'Float',
        'VARCHAR': 'String',
        'CHAR': 'String',
        'TEXT': 'String',
        'TINYTEXT': 'String',
        'MEDIUMTEXT': 'String',
        'LONGTEXT': 'String',
        'ENUM': 'String',
        'SET': 'String',
        'BOOLEAN': 'Boolean',
        'BOOL': 'Boolean',
        'DATE': 'DateTime',
        'DATETIME': 'DateTime',
        'TIMESTAMP': 'DateTime',
        'TIME': 'DateTime',
        'JSON': 'Json',
        'BLOB': 'Bytes',
        'BINARY': 'Bytes',
        'VARBINARY': 'Bytes',
    };

    return typeMap[type] || 'String';
};

export default function SQLConverter() {
    const [mysqlInput, setMysqlInput] = useState('');
    const [prismaOutput, setPrismaOutput] = useState('');
    const [error, setError] = useState('');

    const convertMySQLToPrisma = () => {
        try {
            setError('');
            if (!mysqlInput.trim()) {
                setError('Please enter a MySQL CREATE statement');
                return;
            }

            const prismaSchema = parseMySQLToPrisma(mysqlInput);
            setPrismaOutput(prismaSchema);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error converting SQL');
            setPrismaOutput('');
        }
    };

    const parseMySQLToPrisma = (sql: string): string => {
        // Remove comments and extra whitespace
        let cleanSQL = sql.replace(/--[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '');
        
        // Extract table name
        const tableMatch = cleanSQL.match(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?`?(\w+)`?/i);
        if (!tableMatch) {
            throw new Error('Could not find CREATE TABLE statement');
        }
        const tableName = tableMatch[1];

        // Extract fields between parentheses
        const fieldsMatch = cleanSQL.match(/CREATE\s+TABLE[^(]*\(([\s\S]*)\)/i);
        if (!fieldsMatch) {
            throw new Error('Could not parse table fields');
        }

        const fieldsSection = fieldsMatch[1];
        
        // Split by comma, but be careful with commas inside parentheses
        const lines: string[] = [];
        let currentLine = '';
        let parenDepth = 0;
        
        for (let i = 0; i < fieldsSection.length; i++) {
            const char = fieldsSection[i];
            if (char === '(') parenDepth++;
            if (char === ')') parenDepth--;
            
            if (char === ',' && parenDepth === 0) {
                lines.push(currentLine.trim());
                currentLine = '';
            } else {
                currentLine += char;
            }
        }
        if (currentLine.trim()) {
            lines.push(currentLine.trim());
        }
        
        const fields: string[] = [];
        const constraints: string[] = [];
        let primaryKey: string | null = null;
        const indexes: string[] = [];
        const relations: string[] = [];

        // First pass: find PRIMARY KEY constraints
        for (let line of lines) {
            if (!line) continue;

            // Handle PRIMARY KEY constraint (standalone)
            if (/^PRIMARY\s+KEY/i.test(line)) {
                const pkMatch = line.match(/PRIMARY\s+KEY\s*\(`?(\w+)`?\)/i);
                if (pkMatch) {
                    primaryKey = pkMatch[1];
                }
            }
        }

        // Second pass: parse fields and other constraints
        for (let line of lines) {
            if (!line) continue;

            // Skip standalone PRIMARY KEY (already handled)
            if (/^PRIMARY\s+KEY/i.test(line)) {
                continue;
            }

            // Handle INDEX/KEY
            if (/(?:INDEX|KEY)\s+/i.test(line) && !/FOREIGN\s+KEY/i.test(line)) {
                const indexMatch = line.match(/(?:INDEX|KEY)\s+`?(\w+)`?\s*\(([^)]+)\)/i);
                if (indexMatch) {
                    const indexFields = indexMatch[2].replace(/`/g, '').split(',').map(f => toCamelCase(f.trim()));
                    indexes.push(`@@index([${indexFields.join(', ')}])`);
                }
                continue;
            }

            // Handle UNIQUE constraint (table-level only, not field-level)
            // Only match lines that start with UNIQUE KEY/INDEX
            if (/^UNIQUE\s+(?:KEY|INDEX)/i.test(line)) {
                const uniqueMatch = line.match(/UNIQUE\s+(?:KEY|INDEX)\s*(?:`?\w+`?\s*)?\(([^)]+)\)/i);
                if (uniqueMatch) {
                    const uniqueFields = uniqueMatch[1].replace(/`/g, '').split(',').map(f => toCamelCase(f.trim()));
                    indexes.push(`@@unique([${uniqueFields.join(', ')}])`);
                }
                continue;
            }

            // Handle FOREIGN KEY
            if (/FOREIGN\s+KEY/i.test(line)) {
                const fkMatch = line.match(/FOREIGN\s+KEY\s*\(`?(\w+)`?\)\s*REFERENCES\s+`?(\w+)`?\s*\(`?(\w+)`?\)/i);
                if (fkMatch) {
                    relations.push(`// Foreign key: ${fkMatch[1]} -> ${fkMatch[2]}.${fkMatch[3]}`);
                }
                continue;
            }

            // Parse regular field
            const fieldMatch = line.match(/`?(\w+)`?\s+([^\s,]+)(.*)$/i);
            if (fieldMatch) {
                const originalFieldName = fieldMatch[1];
                const mysqlType = fieldMatch[2].toUpperCase();
                // Remove COMMENT clause from modifiers
                let modifiers = fieldMatch[3].replace(/COMMENT\s+['"][^'"]*['"]/gi, '').trim();

                // Convert field name to camelCase
                const fieldName = toCamelCase(originalFieldName);
                const needsFieldMap = fieldName !== originalFieldName;

                const prismaType = mapMySQLTypeToPrisma(mysqlType);
                let prismaField = `  ${fieldName} ${prismaType}`;
                let isId = false;

                // Check for AUTO_INCREMENT or PRIMARY KEY
                // Compare with original field name for PRIMARY KEY
                if (/AUTO_INCREMENT/i.test(modifiers)) {
                    prismaField += ' @id @default(autoincrement())';
                    isId = true;
                } else if (originalFieldName === primaryKey || /PRIMARY\s+KEY/i.test(modifiers)) {
                    prismaField += ' @id';
                    isId = true;
                }

                // Check for UNIQUE (but not if it's already a primary key)
                if (/UNIQUE/i.test(modifiers) && !isId) {
                    prismaField += ' @unique';
                }

                // Check for DEFAULT first to determine nullability
                // Stop at COMMENT, ON UPDATE, or other SQL keywords
                const defaultMatch = modifiers.match(/DEFAULT\s+(.+?)(?:\s+(?:COMMENT|ON\s+UPDATE|AUTO_INCREMENT|PRIMARY|UNIQUE|CHECK|REFERENCES)|\s*$)/i);
                let hasDefault = false;
                let defaultClause = '';
                
                if (defaultMatch) {
                    hasDefault = true;
                    let defaultValue = defaultMatch[1].trim();
                    let hadQuotes = false;
                    
                    // Remove quotes if present and remember we had them
                    const quotedMatch = defaultValue.match(/^['"](.*)['"]$/);
                    if (quotedMatch) {
                        defaultValue = quotedMatch[1];
                        hadQuotes = true;
                    }
                    
                    if (defaultValue.toUpperCase() === 'CURRENT_TIMESTAMP' || defaultValue.toUpperCase() === 'NOW()') {
                        if (prismaType === 'DateTime') {
                            defaultClause = ' @default(now())';
                        }
                    } else if (defaultValue.toUpperCase() === 'NULL') {
                        hasDefault = false; // NULL default means it's nullable
                    } else if (prismaType === 'String') {
                        // For String types, always use string format even if value looks like a number
                        defaultClause = ` @default("${defaultValue}")`;
                    } else if (prismaType === 'Boolean') {
                        // Boolean type
                        if (defaultValue === '1' || defaultValue.toUpperCase() === 'TRUE') {
                            defaultClause = ' @default(true)';
                        } else if (defaultValue === '0' || defaultValue.toUpperCase() === 'FALSE') {
                            defaultClause = ' @default(false)';
                        } else {
                            defaultClause = ` @default("${defaultValue}")`;
                        }
                    } else if (prismaType === 'Int' || prismaType === 'BigInt') {
                        // Integer types
                        if (/^\d+$/.test(defaultValue)) {
                            defaultClause = ` @default(${defaultValue})`;
                        } else {
                            // If it's not a valid number, treat as string
                            defaultClause = ` @default("${defaultValue}")`;
                        }
                    } else if (prismaType === 'Float' || prismaType === 'Decimal') {
                        // Float/Decimal types
                        if (/^\d+(\.\d+)?$/.test(defaultValue)) {
                            defaultClause = ` @default(${defaultValue})`;
                        } else {
                            defaultClause = ` @default("${defaultValue}")`;
                        }
                    } else if (defaultValue.startsWith('(') && defaultValue.endsWith(')')) {
                        // Function call, skip for now
                        hasDefault = false;
                    } else {
                        // Other types, treat as string
                        defaultClause = ` @default("${defaultValue}")`;
                    }
                }

                // Check for NOT NULL / nullable
                // Rules:
                // 1. Primary keys are always NOT NULL
                // 2. Fields with explicit NOT NULL are not nullable
                // 3. Fields with non-NULL DEFAULT values are typically NOT NULL (unless explicitly nullable)
                // 4. All other fields are nullable
                const hasNotNull = /NOT\s+NULL/i.test(modifiers);
                const isNullable = !isId && !hasNotNull && !hasDefault;
                
                if (isNullable) {
                    prismaField += '?';
                }
                
                // Add default clause after nullable marker
                if (defaultClause) {
                    prismaField += defaultClause;
                }

                // Add @updatedAt for timestamp fields with ON UPDATE
                if (/ON\s+UPDATE\s+CURRENT_TIMESTAMP/i.test(modifiers)) {
                    prismaField += ' @updatedAt';
                }

                // Add @map if field name was converted
                if (needsFieldMap) {
                    prismaField += ` @map("${originalFieldName}")`;
                }

                fields.push(prismaField);
            }
        }

        // Build the Prisma schema with foreign key comments first
        let prismaSchema = '';
        if (relations.length > 0) {
            prismaSchema += relations.join('\n') + '\n\n';
        }

        const modelName = capitalize(tableName);
        prismaSchema += `model ${modelName} {\n`;
        prismaSchema += fields.join('\n') + '\n';
        
        // Add @@map if the model name is different from the table name
        const needsMap = modelName !== tableName;
        
        if (indexes.length > 0 || needsMap) {
            prismaSchema += '\n';
            if (indexes.length > 0) {
                prismaSchema += indexes.map(idx => `  ${idx}`).join('\n') + '\n';
            }
            if (needsMap) {
                prismaSchema += `  @@map("${tableName}")\n`;
            }
        }
        
        prismaSchema += '}';

        return prismaSchema;
    };

    const handleClear = () => {
        setMysqlInput('');
        setPrismaOutput('');
        setError('');
    };

    return (
        <div style={{ padding: 24, maxWidth: 1400 }}>
            <h2>MySQL to Prisma Schema Converter</h2>
            <p style={{ color: '#666', marginBottom: 24 }}>
                Paste your MySQL CREATE TABLE statement and convert it to Prisma schema format
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                {/* Input Section */}
                <div>
                    <h3 style={{ marginTop: 0 }}>MySQL CREATE Statement</h3>
                    <textarea
                        value={mysqlInput}
                        onChange={(e) => setMysqlInput(e.target.value)}
                        placeholder="Paste your MySQL CREATE TABLE statement here..."
                        style={{
                            width: '100%',
                            height: 400,
                            fontFamily: 'monospace',
                            fontSize: 14,
                            padding: 12,
                            border: '1px solid #ddd',
                            borderRadius: 4,
                            resize: 'vertical',
                        }}
                    />
                    <div style={{ marginTop: 12, display: 'flex', gap: 12 }}>
                        <button
                            onClick={convertMySQLToPrisma}
                            style={{
                                padding: '10px 24px',
                                fontSize: 16,
                                backgroundColor: '#0070f3',
                                color: 'white',
                                border: 'none',
                                borderRadius: 4,
                                cursor: 'pointer',
                                fontWeight: 600,
                            }}
                        >
                            Convert
                        </button>
                        <button
                            onClick={handleClear}
                            style={{
                                padding: '10px 24px',
                                fontSize: 16,
                                backgroundColor: '#666',
                                color: 'white',
                                border: 'none',
                                borderRadius: 4,
                                cursor: 'pointer',
                            }}
                        >
                            Clear
                        </button>
                    </div>
                </div>

                {/* Output Section */}
                <div>
                    <h3 style={{ marginTop: 0 }}>Prisma Schema</h3>
                    {error && (
                        <div
                            style={{
                                padding: 12,
                                backgroundColor: '#fee',
                                color: '#c00',
                                borderRadius: 4,
                                marginBottom: 12,
                            }}
                        >
                            {error}
                        </div>
                    )}
                    <textarea
                        value={prismaOutput}
                        readOnly
                        placeholder="Prisma schema will appear here..."
                        style={{
                            width: '100%',
                            height: 400,
                            fontFamily: 'monospace',
                            fontSize: 14,
                            padding: 12,
                            border: '1px solid #ddd',
                            borderRadius: 4,
                            backgroundColor: '#f8f8f8',
                            resize: 'vertical',
                        }}
                    />
                    {prismaOutput && (
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(prismaOutput);
                            }}
                            style={{
                                marginTop: 12,
                                padding: '10px 24px',
                                fontSize: 16,
                                backgroundColor: '#10b981',
                                color: 'white',
                                border: 'none',
                                borderRadius: 4,
                                cursor: 'pointer',
                            }}
                        >
                            Copy to Clipboard
                        </button>
                    )}
                </div>
            </div>

            {/* Example Section */}
            <div style={{ marginTop: 40, padding: 16, backgroundColor: '#f5f5f5', borderRadius: 4 }}>
                <h4 style={{ marginTop: 0 }}>示例 MySQL 语句:</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                        <strong>示例 1: 基本表结构</strong>
                        <pre style={{ fontSize: 12, overflow: 'auto', backgroundColor: 'white', padding: 8, borderRadius: 4 }}>
{`CREATE TABLE user_profiles (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  user_name VARCHAR(100) NOT NULL UNIQUE,
  email_address VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);`}
                        </pre>
                        <div style={{ fontSize: 11, color: '#666', marginTop: 4 }}>
                          ✓ snake_case → camelCase + @map<br/>
                          ✓ 表名 PascalCase + @@map
                        </div>
                    </div>
                    <div>
                        <strong>示例 2: 带注释和索引</strong>
                        <pre style={{ fontSize: 12, overflow: 'auto', backgroundColor: 'white', padding: 8, borderRadius: 4 }}>
{`CREATE TABLE sys_dict (
  id BIGINT NOT NULL COMMENT '编号',
  dict_type VARCHAR(100) COMMENT '字典类型',
  del_flag CHAR(1) DEFAULT '0' COMMENT '删除标志',
  PRIMARY KEY (id),
  KEY idx_del_flag (del_flag)
);`}
                        </pre>
                        <div style={{ fontSize: 11, color: '#666', marginTop: 4 }}>
                          ✓ 自动移除 COMMENT<br/>
                          ✓ 字符串类型的默认值保持为字符串格式
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


