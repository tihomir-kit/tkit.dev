---
title: Automate SQL column encryption using PowerShell
date: "2021-08-05T00:00:00.000Z"
description: How to automate the process of adding or removing encryption from multiple SQL columns at the same time?
featuredImage: /assets/featured/database.png
commentsUrl: https://github.com/pootzko/tkit.dev/issues/49
tags: ["sql", "automation", "powershell", "encryption"]
---

This post will demonstrate how you can automate the process of adding or removing encryption from multiple SQL columns at the same time. The post assumes that you already have column encryption at least partially in place in your DB (the encryption key must already exist).

Having a script like this can help if want to version-control the process. You can then apply the changes on multiple DB's such as prod, test, dev without too much clicking around SSMS and without fear that you might miss a column somewhere..

You can also use it if you need to temporarily remove encryption and then put it back up for some reason. For example, I recently had an issue that an SSMS-generated change script was using an intermediary table to move the data around because I renamed one of the columns. It basically creates a new table, moves the data to it, removes the old table, creates a new table with a changed column name, and then re-inserts the data. The change script was failing because it couldn't handle encrypted columns properly on data re-insertion. So I used this PowerShell script to temporarily disable the encryption for a few minutes, then I ran the change script and then put the encryption back up.

```powershell
# Run the script from administrator PowerShell.
# ---
# Forced install of the SqlServer module might be required (don't run this from inside
# the script, but separately, outside, and then run the script afterwards):
#   Install-Module -Name SqlServer -Force -AllowClobber

Import-Module SqlServer

$server = "YOUR_SERVER.database.windows.net"
$dbname = ""
$username = ""
$password = "" # If password contains $ escape it like this: `$
$sqlConnectionString = "Data Source=$server;Initial Catalog=$dbname;User ID=$username;Password=$password;MultipleActiveResultSets=False;Connect Timeout=30;Encrypt=True;TrustServerCertificate=False;Packet Size=4096;Application Name=`"Microsoft SQL Server Management Studio`""

$smoDatabase = Get-SqlDatabase -ConnectionString $sqlConnectionString



# Encryption / Decryption powershell command is idempotent, so if you add a column
# name to this list, that's already encrypted, the script won't break.

$fields = @(
  'dbo.TableName1.Column1',
  'dbo.TableName1.Column2',
  'dbo.TableName1.Column3',
  'dbo.TableName2.Column1',
  'dbo.TableName2.Column2',
  'dbo.TableName2.Column3',
  'dbo.TableName2.Column4',
)



###################################
# SELECT ENCRYPTION OR DECRYPTION #
###################################

$encryptionChanges = @()

# Add encryption
$encryptionKey = "CEK_Auto1" # You can find the encryption key name through SSMS when you right-click on table -> encrypt columns
$fields | ForEach-Object {$encryptionChanges += New-SqlColumnEncryptionSettings -ColumnName $PSItem -EncryptionType Deterministic -EncryptionKey $encryptionKey}

# Remove encryption
# $fields | ForEach-Object {$encryptionChanges += New-SqlColumnEncryptionSettings -ColumnName $PSItem -EncryptionType Plaintext}

Set-SqlColumnEncryption -ColumnEncryptionSettings $encryptionChanges -InputObject $smoDatabase
```

You can use the following SQL code (from SSMS) to find all the encrypted columns in the database:

```sql
SELECT
    t.name AS [Table],
    c.name AS [Column],
    c.encryption_type_desc
FROM
    sys.all_columns c INNER JOIN
    sys.tables t ON c.object_id = t.object_id
WHERE
    c.encryption_type IS NOT NULL
ORDER BY
    t.name,
    c.name
```