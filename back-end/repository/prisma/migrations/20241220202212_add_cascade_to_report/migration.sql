-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_messageId_fkey";

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;
