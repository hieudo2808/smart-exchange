BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Users] (
    [userId] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [Users_userId_df] DEFAULT NEWSEQUENTIALID(),
    [email] VARCHAR(50) NOT NULL,
    [password] VARCHAR(80) NOT NULL,
    [fullName] NVARCHAR(100) NOT NULL,
    [jobTitle] NVARCHAR(100),
    [languageCode] VARCHAR(3) NOT NULL CONSTRAINT [Users_languageCode_df] DEFAULT 'jp',
    [themeMode] VARCHAR(7) NOT NULL CONSTRAINT [Users_themeMode_df] DEFAULT 'light',
    [isTutorialCompleted] BIT NOT NULL CONSTRAINT [Users_isTutorialCompleted_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Users_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Users_pkey] PRIMARY KEY CLUSTERED ([userId]),
    CONSTRAINT [Users_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[Chat] (
    [chatId] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [Chat_chatId_df] DEFAULT NEWSEQUENTIALID(),
    [userOneId] UNIQUEIDENTIFIER NOT NULL,
    [userTwoId] UNIQUEIDENTIFIER NOT NULL,
    [updateAt] DATETIME2 NOT NULL CONSTRAINT [Chat_updateAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Chat_pkey] PRIMARY KEY CLUSTERED ([chatId]),
    CONSTRAINT [Chat_userOneId_userTwoId_key] UNIQUE NONCLUSTERED ([userOneId],[userTwoId])
);

-- CreateTable
CREATE TABLE [dbo].[Messages] (
    [messageId] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [Messages_messageId_df] DEFAULT NEWSEQUENTIALID(),
    [chatId] UNIQUEIDENTIFIER NOT NULL,
    [senderId] UNIQUEIDENTIFIER NOT NULL,
    [content] NVARCHAR(max) NOT NULL,
    [aiAnalysisContent] NVARCHAR(max),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Messages_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [isRead] BIT NOT NULL CONSTRAINT [Messages_isRead_df] DEFAULT 0,
    CONSTRAINT [Messages_pkey] PRIMARY KEY CLUSTERED ([messageId])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IDX_Chat_UserOne_Sort] ON [dbo].[Chat]([userOneId], [updateAt] DESC);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IDX_Chat_UserTwo_Sort] ON [dbo].[Chat]([userTwoId], [updateAt] DESC);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IDX_Messages_GetContent] ON [dbo].[Messages]([chatId], [createdAt] DESC);

-- AddForeignKey
ALTER TABLE [dbo].[Chat] ADD CONSTRAINT [Chat_userOneId_fkey] FOREIGN KEY ([userOneId]) REFERENCES [dbo].[Users]([userId]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Chat] ADD CONSTRAINT [Chat_userTwoId_fkey] FOREIGN KEY ([userTwoId]) REFERENCES [dbo].[Users]([userId]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Messages] ADD CONSTRAINT [Messages_chatId_fkey] FOREIGN KEY ([chatId]) REFERENCES [dbo].[Chat]([chatId]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Messages] ADD CONSTRAINT [Messages_senderId_fkey] FOREIGN KEY ([senderId]) REFERENCES [dbo].[Users]([userId]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
