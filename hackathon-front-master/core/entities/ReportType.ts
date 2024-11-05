export class ReportType {
	public id: string;
	public type: string;
	public description: string;
	public iconNormal: string;
	public iconSmall: string;
	public createdAt: string;

	constructor(dto: any) {
		this.id = dto._id;
		this.type = dto.type;
		this.description = dto.description;
		this.iconNormal = dto.icons.icon_normal;
		this.iconSmall = dto.icons.icon_small;
		this.createdAt = dto.createdAt;
	}
}
