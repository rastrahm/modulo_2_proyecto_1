import { create } from 'ipfs-http-client';

class IPFSService {
    constructor() {
        this.ipfs = null;
        this.gateway = process.env.REACT_APP_IPFS_GATEWAY || 'https://ipfs.io/ipfs/';
    }

    async initialize() {
        try {
            // Configurar cliente IPFS
            const ipfsUrl = process.env.REACT_APP_IPFS_URL || 'http://127.0.0.1:5001';
            this.ipfs = create({ url: ipfsUrl });

            // Verificar conexión
            const version = await this.ipfs.version();
            console.log('IPFS conectado:', version);

        } catch (error) {
            console.error('Error conectando a IPFS:', error);
            // Fallback a un servicio público
            this.ipfs = create({ url: 'https://ipfs.infura.io:5001/api/v0' });
        }
    }

    /**
     * Sube un archivo a IPFS
     * @param {File} file - Archivo a subir
     * @returns {Promise<string>} - Hash IPFS del archivo
     */
    async uploadFile(file) {
        try {
            if (!this.ipfs) {
                await this.initialize();
            }

            // Convertir archivo a buffer
            const fileBuffer = await file.arrayBuffer();

            // Subir a IPFS
            const result = await this.ipfs.add(fileBuffer, {
                pin: true,
                progress: (prog) => console.log(`Subiendo: ${prog}`)
            });

            console.log('Archivo subido a IPFS:', result.path);
            return result.path;

        } catch (error) {
            console.error('Error subiendo archivo a IPFS:', error);
            throw new Error('Error al subir el archivo a IPFS');
        }
    }

    /**
     * Sube múltiples archivos a IPFS
     * @param {File[]} files - Array de archivos
     * @returns {Promise<string[]>} - Array de hashes IPFS
     */
    async uploadFiles(files) {
        try {
            if (!this.ipfs) {
                await this.initialize();
            }

            const uploadPromises = files.map(file => this.uploadFile(file));
            const hashes = await Promise.all(uploadPromises);

            return hashes;

        } catch (error) {
            console.error('Error subiendo archivos a IPFS:', error);
            throw new Error('Error al subir los archivos a IPFS');
        }
    }

    /**
     * Obtiene la URL completa de un archivo en IPFS
     * @param {string} hash - Hash IPFS del archivo
     * @returns {string} - URL completa del archivo
     */
    getFileUrl(hash) {
        if (!hash) return '';

        // Remover el prefijo /ipfs/ si existe
        const cleanHash = hash.replace('/ipfs/', '');
        return `${this.gateway}${cleanHash}`;
    }

    /**
     * Sube datos JSON a IPFS
     * @param {Object} data - Datos a subir
     * @returns {Promise<string>} - Hash IPFS de los datos
     */
    async uploadJSON(data) {
        try {
            if (!this.ipfs) {
                await this.initialize();
            }

            const jsonString = JSON.stringify(data, null, 2);
            const result = await this.ipfs.add(jsonString, {
                pin: true
            });

            console.log('JSON subido a IPFS:', result.path);
            return result.path;

        } catch (error) {
            console.error('Error subiendo JSON a IPFS:', error);
            throw new Error('Error al subir los datos a IPFS');
        }
    }

    /**
     * Descarga y parsea datos JSON desde IPFS
     * @param {string} hash - Hash IPFS del archivo
     * @returns {Promise<Object>} - Datos parseados
     */
    async downloadJSON(hash) {
        try {
            if (!this.ipfs) {
                await this.initialize();
            }

            const chunks = [];
            for await (const chunk of this.ipfs.cat(hash)) {
                chunks.push(chunk);
            }

            const data = Buffer.concat(chunks).toString();
            return JSON.parse(data);

        } catch (error) {
            console.error('Error descargando JSON desde IPFS:', error);
            throw new Error('Error al descargar los datos desde IPFS');
        }
    }

    /**
     * Verifica si un archivo existe en IPFS
     * @param {string} hash - Hash IPFS del archivo
     * @returns {Promise<boolean>} - True si el archivo existe
     */
    async fileExists(hash) {
        try {
            if (!this.ipfs) {
                await this.initialize();
            }

            const stats = await this.ipfs.files.stat(`/ipfs/${hash}`);
            return stats !== null;

        } catch (error) {
            console.error('Error verificando archivo en IPFS:', error);
            return false;
        }
    }

    /**
     * Obtiene información de un archivo en IPFS
     * @param {string} hash - Hash IPFS del archivo
     * @returns {Promise<Object>} - Información del archivo
     */
    async getFileInfo(hash) {
        try {
            if (!this.ipfs) {
                await this.initialize();
            }

            const stats = await this.ipfs.files.stat(`/ipfs/${hash}`);
            return {
                hash: hash,
                size: stats.size,
                type: stats.type,
                url: this.getFileUrl(hash)
            };

        } catch (error) {
            console.error('Error obteniendo información del archivo:', error);
            throw new Error('Error al obtener información del archivo');
        }
    }

    /**
     * Valida que un archivo sea una imagen válida
     * @param {File} file - Archivo a validar
     * @returns {boolean} - True si es una imagen válida
     */
    validateImageFile(file) {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        const maxSize = 10 * 1024 * 1024; // 10MB

        if (!allowedTypes.includes(file.type)) {
            throw new Error('Tipo de archivo no válido. Solo se permiten imágenes (JPEG, PNG, GIF, WebP)');
        }

        if (file.size > maxSize) {
            throw new Error('El archivo es demasiado grande. Máximo 10MB');
        }

        return true;
    }

    /**
     * Optimiza una imagen antes de subirla
     * @param {File} file - Archivo de imagen
     * @param {number} maxWidth - Ancho máximo
     * @param {number} maxHeight - Alto máximo
     * @param {number} quality - Calidad de compresión (0-1)
     * @returns {Promise<File>} - Imagen optimizada
     */
    async optimizeImage(file, maxWidth = 800, maxHeight = 600, quality = 0.8) {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = () => {
                // Calcular nuevas dimensiones manteniendo la proporción
                let { width, height } = img;

                if (width > height) {
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = (width * maxHeight) / height;
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                // Dibujar imagen redimensionada
                ctx.drawImage(img, 0, 0, width, height);

                // Convertir a blob
                canvas.toBlob(
                    (blob) => {
                        const optimizedFile = new File([blob], file.name, {
                            type: file.type,
                            lastModified: Date.now()
                        });
                        resolve(optimizedFile);
                    },
                    file.type,
                    quality
                );
            };

            img.onerror = () => reject(new Error('Error al cargar la imagen'));
            img.src = URL.createObjectURL(file);
        });
    }
}

export const ipfsService = new IPFSService();