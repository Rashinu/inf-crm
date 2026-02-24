import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FilesService {
    private s3Client: S3Client;
    private bucketName: string;

    constructor(private configService: ConfigService) {
        this.s3Client = new S3Client({
            region: 'us-east-1', // MinIO covers this
            endpoint: this.configService.get('S3_ENDPOINT', 'http://localhost:9002'),
            forcePathStyle: true,
            credentials: {
                accessKeyId: this.configService.get('S3_ACCESS_KEY', 'minioadmin'),
                secretAccessKey: this.configService.get('S3_SECRET_KEY', 'minioadmin'),
            },
        });
        this.bucketName = this.configService.get('S3_BUCKET', 'contracts');
    }

    async getPresignedUrl(fileName: string, contentType: string) {
        const fileKey = `${uuidv4()}-${fileName}`;
        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: fileKey,
            ContentType: contentType,
        });

        const uploadUrl = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });

        return {
            uploadUrl,
            fileKey,
        };
    }
}
